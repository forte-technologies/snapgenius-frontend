import { useState, useRef, useEffect } from 'react';
import { ENDPOINTS, apiClient } from '../config/api';
import { useAuth } from '../contexts/useAuth';

const ChatInterface = () => {
    const { accessToken } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useStreaming, setUseStreaming] = useState(true);
    const [chatToken, setChatToken] = useState(null);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [selectedAssistant, setSelectedAssistant] = useState('rag');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (useStreaming) fetchChatToken();
    }, [useStreaming, accessToken]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingMessage]);

    const fetchChatToken = async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.CHAT.TOKEN);
            setChatToken(response.data.token);
        } catch (error) {
            console.error('Error fetching chat token:', error);
            setUseStreaming(false);
        }
    };

    const handleInputChange = (e) => setInputMessage(e.target.value);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        if (useStreaming && chatToken) {
            await handleStreamingChat(userMessage.text);
        } else {
            await handleRegularChat(userMessage.text);
        }
    };

    const handleRegularChat = async (message) => {
        try {
            const response = await apiClient.post(ENDPOINTS.CHAT.RAG, { message });
            const aiMessage = {
                id: Date.now() + 1,
                text: response.data.response,
                sender: 'ai',
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            handleChatError();
        } finally {
            setIsLoading(false);
        }
    };

    const handleStreamingChat = async (message) => {
        setStreamingMessage('');
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${chatToken}`,
        };

        const endpoint =
            selectedAssistant === 'rag'
                ? ENDPOINTS.CHAT.MICRO_STRICT_RAG_STREAM
                : ENDPOINTS.CHAT.MICRO_GENERAL_STREAM;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullMessage = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                fullMessage += chunk;
                setStreamingMessage(fullMessage);
            }

            if (fullMessage) {
                const aiMessage = {
                    id: Date.now() + 1,
                    text: fullMessage,
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                setStreamingMessage('');
            }
        } catch (error) {
            console.error('Streaming chat error:', error);
            await handleRegularChat(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChatError = () => {
        const errorMessage = {
            id: Date.now() + 1,
            text: 'Sorry, I encountered an error. Please try again.',
            sender: 'ai',
            isError: true,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
    };

    const toggleStreamingMode = () => {
        setUseStreaming(!useStreaming);
        if (!useStreaming && !chatToken) fetchChatToken();
    };

    return (
        <div className="border border-zinc-200 rounded-lg overflow-hidden flex flex-col h-[500px]">
            <div className="p-3 bg-zinc-100 border-b border-zinc-200 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium m-0">Chat with snapGenius</h3>
                    <div className="flex items-center gap-2">
            <span
                className={`w-2.5 h-2.5 rounded-full inline-block ${
                    useStreaming && chatToken ? 'bg-green-500' : 'bg-red-500'
                }`}
            />
                        <button
                            onClick={toggleStreamingMode}
                            className={`text-xs px-2 py-1 rounded border text-zinc-700 transition ${
                                useStreaming ? 'bg-blue-50 border-zinc-200' : 'bg-zinc-100 border-zinc-200'
                            }`}
                        >
                            {useStreaming ? 'High Speed Chat On' : 'High Speed Chat Off'}
                        </button>
                    </div>
                </div>

                <div className="flex bg-zinc-300 rounded p-0.5">
                    {['rag', 'general'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedAssistant(type)}
                            className={`flex-1 text-xs font-medium px-2 py-1 rounded transition ${
                                selectedAssistant === type
                                    ? 'bg-white text-blue-500 shadow-sm'
                                    : 'bg-transparent text-zinc-600'
                            }`}
                        >
                            {type === 'rag' ? 'Image Chat' : 'General Chat'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.length === 0 ? (
                    <div className="text-center text-zinc-500 m-auto text-sm">
                        <p>
                            {selectedAssistant === 'rag'
                                ? 'Start a conversation about your uploaded images!'
                                : "Ask me anything! I'm your general assistant."}
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`max-w-[80%] text-sm p-3 rounded-xl ${
                                message.sender === 'user'
                                    ? 'self-end bg-blue-50 rounded-br-sm'
                                    : message.isError
                                        ? 'bg-red-100 self-start'
                                        : 'bg-zinc-100 self-start rounded-bl-sm'
                            }`}
                        >
                            <div className="whitespace-pre-wrap">{message.text}</div>
                            <div className="text-xs text-zinc-500 mt-1 text-right">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>
                    ))
                )}

                {streamingMessage && (
                    <div className="max-w-[80%] self-start bg-zinc-100 p-3 rounded-xl rounded-bl-sm break-words text-sm">
                        <div className="whitespace-pre-wrap">{streamingMessage}</div>
                        <div className="text-xs text-zinc-500 mt-1 text-right flex items-center justify-end">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block mr-1.5" />
                            Typing...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 p-3 border-t border-zinc-200 bg-zinc-50"
            >
                <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder={
                        selectedAssistant === 'rag'
                            ? 'Ask about your images...'
                            : 'Ask me anything...'
                    }
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-zinc-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
                <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                        inputMessage.trim() && !isLoading
                            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                            : 'bg-blue-200 text-white cursor-not-allowed opacity-70'
                    }`}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
