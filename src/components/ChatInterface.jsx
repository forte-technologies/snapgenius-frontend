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
    const [selectedAssistant, setSelectedAssistant] = useState('rag'); // 'rag' or 'general'
    const messagesEndRef = useRef(null);


    // Fetch chat token on component mount
    useEffect(() => {
        if (useStreaming) {
            fetchChatToken();
        }
    }, [useStreaming, accessToken]);


    // Auto-scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingMessage]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const fetchChatToken = async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.CHAT.TOKEN);
            setChatToken(response.data.token);
        } catch (error) {
            console.error('Error fetching chat token:', error);
            // Fall back to non-streaming mode if token fetch fails
            setUseStreaming(false);
        }
    };


    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;


        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toISOString()
        };


        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);


        // Use streaming chat if enabled and token is available
        if (useStreaming && chatToken) {
            await handleStreamingChat(userMessage.text);
        } else {
            await handleRegularChat(userMessage.text);
        }
    };


    const handleRegularChat = async (message) => {
        try {
            const response = await apiClient.post(ENDPOINTS.CHAT.RAG, {
                message: message
            });


            const aiMessage = {
                id: Date.now() + 1,
                text: response.data.response,
                sender: 'ai',
                timestamp: new Date().toISOString()
            };


            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            handleChatError();
        } finally {
            setIsLoading(false);
        }
    };


    const handleStreamingChat = async (message) => {
        setStreamingMessage('');

        // Choose the correct endpoint based on selected assistant
        let endpoint;
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${chatToken}` // Both endpoints now use chat token
        };
        
        // Set appropriate endpoints - both now use microservice
        if (selectedAssistant === 'rag') {
            // Image Chat uses microservice endpoint
            endpoint = ENDPOINTS.CHAT.MICRO_STRICT_RAG_STREAM;
        } else {
            // General Chat now also uses microservice endpoint
            endpoint = ENDPOINTS.CHAT.MICRO_GENERAL_STREAM;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ message: message })
            });


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


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
                    timestamp: new Date().toISOString()
                };


                setMessages(prev => [...prev, aiMessage]);
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
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
    };


    const toggleStreamingMode = () => {
        setUseStreaming(!useStreaming);
        if (!useStreaming && !chatToken) {
            fetchChatToken();
        }
    };


    return (
        <div className="chat-interface" style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '500px'
        }}>
            <div className="chat-header" style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Chat with snapGenius</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: useStreaming && chatToken ? '#4caf50' : '#f44336',
                                display: 'inline-block'
                            }}
                            title={useStreaming && chatToken ? 'Streaming enabled' : 'Streaming disabled'}
                        />
                        <button
                            onClick={toggleStreamingMode}
                            style={{
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                backgroundColor: useStreaming ? '#e3f2fd' : '#f5f5f5',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {useStreaming ? 'High Speed Chat On' : 'High Speed Chat Off'}
                        </button>
                    </div>
                </div>
                
                {/* Assistant Type Toggle */}
                <div style={{ 
                    display: 'flex', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px', 
                    padding: '2px' 
                }}>
                    <button
                        onClick={() => setSelectedAssistant('rag')}
                        style={{
                            flex: 1,
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            fontWeight: 'medium',
                            backgroundColor: selectedAssistant === 'rag' ? 'white' : 'transparent',
                            color: selectedAssistant === 'rag' ? '#2196f3' : '#555',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            boxShadow: selectedAssistant === 'rag' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        Image Chat
                    </button>
                    <button
                        onClick={() => setSelectedAssistant('general')}
                        style={{
                            flex: 1,
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            fontWeight: 'medium',
                            backgroundColor: selectedAssistant === 'general' ? 'white' : 'transparent',
                            color: selectedAssistant === 'general' ? '#2196f3' : '#555',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            boxShadow: selectedAssistant === 'general' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        General Chat
                    </button>
                </div>
            </div>
            <div className="chat-messages" style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
            }}>
                {messages.length === 0 ? (
                    <div className="empty-state" style={{
                        textAlign: 'center',
                        color: '#888',
                        margin: 'auto 0'
                    }}>
                        <p>{selectedAssistant === 'rag' 
                          ? 'Start a conversation about your uploaded images!' 
                          : 'Ask me anything! I\'m your general assistant.'}
                        </p>
                    </div>
                ) : (
                    messages.map(message => (
                        <div
                            key={message.id}
                            className={`message ${message.sender}`}
                            style={{
                                maxWidth: '80%',
                                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: message.sender === 'user' ? '#e3f2fd' : (message.isError ? '#ffebee' : '#f1f1f1'),
                                padding: '0.75rem 1rem',
                                borderRadius: '1rem',
                                borderBottomRightRadius: message.sender === 'user' ? '0.25rem' : '1rem',
                                borderBottomLeftRadius: message.sender === 'user' ? '1rem' : '0.25rem',
                            }}
                        >
                            <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>
                                {message.text}
                            </div>
                            <div className="message-time" style={{
                                fontSize: '0.75rem',
                                color: '#888',
                                marginTop: '0.35rem',
                                textAlign: 'right'
                            }}>
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))
                )}


                {/* Streaming message */}
                {streamingMessage && (
                    <div
                        className="message ai streaming"
                        style={{
                            maxWidth: '80%',
                            alignSelf: 'flex-start',
                            backgroundColor: '#f1f1f1',
                            padding: '0.75rem 1rem',
                            borderRadius: '1rem',
                            borderBottomLeftRadius: '0.25rem',
                            wordBreak: 'break-word'  // Ensures words wrap properly
                        }}
                    >
                        <div className="message-text" style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'  // Ensures words wrap properly
                        }}>
                            {streamingMessage}
                        </div>
                        <div className="message-time" style={{
                            fontSize: '0.75rem',
                            color: '#888',
                            marginTop: '0.35rem',
                            textAlign: 'right',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}>
                           <span style={{
                               width: '6px',
                               height: '6px',
                               borderRadius: '50%',
                               backgroundColor: '#2196f3',
                               display: 'inline-block',
                               marginRight: '4px'
                           }}></span>
                            Typing...
                        </div>
                    </div>
                )}


                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chat-input" style={{
                display: 'flex',
                padding: '0.75rem',
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f9f9f9'
            }}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder={selectedAssistant === 'rag' 
                        ? "Ask about your images..." 
                        : "Ask me anything..."}
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '1.5rem',
                        marginRight: '0.5rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    style={{
                        backgroundColor: '#2196f3',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '1.5rem',
                        cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                        opacity: inputMessage.trim() && !isLoading ? 1 : 0.7
                    }}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};


export default ChatInterface;


