// src/hooks/useChatService.js
import { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS, apiClient } from '../config/api';

export const useChatService = () => {
    const [chatToken, setChatToken] = useState(null);
    const [isStreaming, setIsStreaming] = useState(true);
    const [tokenLoading, setTokenLoading] = useState(false);
    const [tokenError, setTokenError] = useState(null);

    // Fetch chat token on mount
    useEffect(() => {
        if (isStreaming) {
            fetchChatToken();
        }
    }, [isStreaming]);

    // Fetch chat token
    const fetchChatToken = useCallback(async () => {
        if (tokenLoading || chatToken) return;

        setTokenLoading(true);
        setTokenError(null);

        try {
            const response = await apiClient.get(ENDPOINTS.CHAT.TOKEN);
            setChatToken(response.data.token);
        } catch (error) {
            console.error('Error fetching chat token:', error);
            setTokenError(error);
            // Don't automatically disable streaming - let component decide
        } finally {
            setTokenLoading(false);
        }
    }, [chatToken, tokenLoading]);

    // Send message with streaming
    const sendStreamingMessage = useCallback(async (message) => {
        if (!chatToken) {
            throw new Error('Chat token not available');
        }

        // Create a response handler that emits chunks as they arrive
        const streamHandler = async (onChunk, onComplete, onError) => {
            try {
                const response = await fetch(ENDPOINTS.CHAT.STREAM, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${chatToken}`
                    },
                    body: JSON.stringify({ message })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullMessage = '';

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        onComplete(fullMessage);
                        break;
                    }

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.substring(6);
                            fullMessage += data;
                            onChunk(data, fullMessage);
                        }
                    }
                }
            } catch (error) {
                onError(error);

                // Handle token expiration
                if (error.message.includes('401')) {
                    setChatToken(null);
                    fetchChatToken();
                }
            }
        };

        return streamHandler;
    }, [chatToken, fetchChatToken]);

    // Send message without streaming
    const sendRegularMessage = useCallback(async (message) => {
        const response = await apiClient.post(ENDPOINTS.CHAT.RAG, { message });
        return response.data.response;
    }, []);

    // Toggle streaming mode
    const toggleStreaming = useCallback(() => {
        setIsStreaming(prev => {
            const newValue = !prev;
            // If turning on streaming and no token, fetch one
            if (newValue && !chatToken) {
                fetchChatToken();
            }
            return newValue;
        });
    }, [chatToken, fetchChatToken]);

    return {
        chatToken,
        isStreaming,
        tokenLoading,
        tokenError,
        fetchChatToken,
        sendStreamingMessage,
        sendRegularMessage,
        toggleStreaming,
        canStream: !!chatToken
    };
};

export default useChatService;