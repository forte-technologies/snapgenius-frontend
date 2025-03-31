import { useState, useRef, useEffect } from 'react';
import { ENDPOINTS, apiClient } from '../config/api';

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

        try {
            const response = await apiClient.post(ENDPOINTS.CHAT.RAG, {
                message: userMessage.text
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
            const errorMessage = {
                id: Date.now() + 1,
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'ai',
                isError: true,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
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
                borderBottom: '1px solid #e0e0e0'
            }}>
                <h3 style={{ margin: 0 }}>Chat with My Genius</h3>
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
                        <p>Start a conversation about your uploaded images!</p>
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
                    placeholder="Ask about your images..."
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