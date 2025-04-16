import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '../contexts/useAuth'; // Assuming useAuth provides token AND logout
import { apiClient, ENDPOINTS } from '../config/api'; // Import apiClient and ENDPOINTS
import { streamAcademicChat } from '../services/academicChatService';
import PromptDialGroup from '../components/PromptDialGroup';
import ImageUploader from '../components/ImageUploader';
import DocumentUploader from '../components/DocumentUploader';

// Helper to format timestamp
const formatTimestamp = (isoString) => {
    try {
        return new Date(isoString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'Invalid Date';
    }
};

function AcademicChatPage() {
    // Get logout function and accessToken from auth context
    const { accessToken, logout } = useAuth(); 
    const navigate = useNavigate(); // Hook for navigation after logout
    const [chatToken, setChatToken] = useState(null); // State for the stream-specific token
    const [tokenError, setTokenError] = useState(null); // State for token fetching errors
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [promptSettings, setPromptSettings] = useState({
        tone: 0.5,
        complexity: 0.5,
        focus: 0.5,
        depth: 0.5,
        clarity: 0.5,
    });
    const messagesEndRef = useRef(null);
    const activeStreamRef = useRef(null); // To manage stopping the stream

    // Fetch chat token when component mounts or accessToken changes
    useEffect(() => {
        const fetchChatToken = async () => {
            if (!accessToken) {
                setChatToken(null);
                return;
            }
            try {
                setTokenError(null); // Clear previous errors
                // Use apiClient which includes the main accessToken interceptor
                const response = await apiClient.get(ENDPOINTS.CHAT.TOKEN); 
                setChatToken(response.data.token);
                console.log("Chat token fetched successfully.");
            } catch (error) {
                console.error('Error fetching chat token:', error);
                setTokenError('Failed to initialize chat session. Please refresh.');
                setChatToken(null); 
            }
        };

        fetchChatToken();
    }, [accessToken]); // Dependency on the main accessToken

    // Scroll to bottom effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingMessage]);

    // Cleanup ongoing stream on unmount
    useEffect(() => {
        return () => {
            // If there's an active stream controller/reader, cancel it
            // The exact mechanism depends on how streamAcademicChat signals cancellation
            // For fetch ReadableStream, a controller isn't directly exposed here.
            // We might need to enhance streamAcademicChat or handle it differently
            // if explicit cancellation is required before unmount.
            activeStreamRef.current = null; // Indicate stream is no longer active
        };
    }, []);

    const handleInputChange = (e) => setInputMessage(e.target.value);

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        // Check for chatToken availability and token errors
        if (!inputMessage.trim() || isLoading || !chatToken || tokenError) return;

        const userMessageText = inputMessage;
        const userMessage = {
            id: Date.now(),
            text: userMessageText,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setStreamingMessage(''); // Clear previous streaming message
        
        activeStreamRef.current = true; // Mark stream as active
        let fullMessage = '';

        try {
            // Pass the chatToken (NOT accessToken) to the stream service
            const stream = streamAcademicChat(userMessageText, promptSettings, chatToken);

            for await (const chunk of stream) {
                if (!activeStreamRef.current) { // Check if component unmounted or stream cancelled
                    console.log('Stream processing stopped.');
                    break;
                }
                fullMessage += chunk;
                setStreamingMessage(fullMessage);
            }

            if (fullMessage && activeStreamRef.current) {
                const aiMessage = {
                    id: Date.now() + 1, // Ensure unique ID
                    text: fullMessage,
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error('Error handling academic stream:', error);
            // Handle stream errors (e.g., network issues during streaming)
             const errorMessage = {
                id: Date.now() + 1,
                // Use the error message yielded by the service if available, or a default
                text: error?.message?.includes('HTTP error') ? 'Connection error during chat. Please try again.' : 'Sorry, I encountered an error processing your request.',
                sender: 'ai',
                isError: true,
                timestamp: new Date().toISOString(),
            };
             setMessages((prev) => [...prev, errorMessage]);
        } finally {
            if (activeStreamRef.current) { // Only reset if stream wasn't stopped externally
                setIsLoading(false);
                setStreamingMessage('');
                activeStreamRef.current = false; // Mark stream as inactive
            }
        }
        // Re-enable input if token error exists, allowing user to see the error message
        // (isLoading might still be true briefly, but this ensures re-enabling)
        if (tokenError) {
             setIsLoading(false);
        }
    }, [inputMessage, isLoading, chatToken, promptSettings, tokenError]); // Include chatToken and tokenError in dependencies

    const handleUploadSuccess = useCallback((data) => {
        // Optionally, add a system message indicating successful upload
        console.log('Upload successful:', data);
        // Maybe trigger a specific action or just notify the user
        // Example: Add a message to the chat confirming the upload
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: `Successfully uploaded ${data.fileName}. You can now ask questions about it.`,
            sender: 'system', // Or 'ai' styled differently
            timestamp: new Date().toISOString(),
        }]);
    }, []);

    // Handle Sign Out action
    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate('/'); // Redirect to home page after successful logout
        }
        // Optionally handle logout failure
    };

    return (
        <div className="flex h-screen bg-zinc-900 text-white">
            {/* Left Sidebar: Dials and Uploads */}
            <aside className="w-72 p-4 border-r border-zinc-700 flex flex-col overflow-y-auto">
                {/* Header with Title and Sign Out */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-zinc-200">Academic Assistant</h2>
                    <button
                        onClick={handleLogout}
                        className="text-xs px-2 py-1 rounded border border-zinc-600 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition"
                        title="Sign Out"
                    >
                        Sign Out
                    </button>
                </div>
                
                {/* Navigation back to Dashboard */}
                <Link 
                    to="/dashboard"
                    className="mb-4 text-xs text-center px-3 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition shadow-sm flex items-center justify-center gap-1.5"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M7.78 12.53a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 1 1 1.06 1.06L4.81 7.25h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </Link>

                {/* Display Token Error if any */}
                {tokenError && (
                    <div className="mb-4 p-2 bg-red-800 text-red-100 text-xs rounded border border-red-600 text-center">
                        {tokenError}
                    </div>
                )}
                
                {/* Dials */}
                <PromptDialGroup 
                    settings={promptSettings} 
                    onSettingsChange={setPromptSettings} 
                    className="mb-4" // Add margin if needed
                />

                {/* Uploaders */}
                <div className="mt-4 space-y-4 p-4 rounded-lg bg-zinc-800 border border-zinc-700 shadow-inner flex-shrink-0">
                    <h3 className="text-sm font-medium text-zinc-200 mb-2">Upload Files</h3>
                    <div className="text-xs text-zinc-400 mb-3">Upload images or documents relevant to your academic query.</div>
                    <ImageUploader onUploadSuccess={handleUploadSuccess} />
                    <DocumentUploader onUploadSuccess={handleUploadSuccess} />
                </div>

                {/* Spacer to push elements up if content is short */}
                <div className="flex-grow"></div> 

            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col">
                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] text-sm p-3 rounded-lg shadow-sm ${message.sender === 'user'
                                        ? 'bg-violet-600 text-white rounded-br-none'
                                        : message.isError
                                            ? 'bg-red-800 text-red-100 rounded-bl-none'
                                            : message.sender === 'system'
                                                ? 'bg-zinc-600 text-zinc-300 text-center w-full max-w-none rounded-md italic'
                                                : 'bg-zinc-700 text-zinc-100 rounded-bl-none'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap break-words">{message.text}</div>
                                {message.sender !== 'system' && (
                                    <div className="text-xs text-zinc-400 mt-1.5 text-right">
                                        {formatTimestamp(message.timestamp)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Live Streaming Message */}
                    {streamingMessage && (
                        <div className="flex justify-start">
                            <div className="max-w-[70%] bg-zinc-700 text-zinc-100 p-3 rounded-lg rounded-bl-none shadow-sm animate-pulse">
                                <div className="whitespace-pre-wrap break-words">{streamingMessage}</div>
                                <div className="text-xs text-zinc-400 mt-1.5 text-right flex items-center justify-end">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block mr-1.5 animate-ping"></span>
                                    Typing...
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-zinc-700 bg-zinc-800">
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-3"
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={handleInputChange}
                            placeholder={tokenError ? "Chat unavailable" : "Ask your academic question..."} // Change placeholder on error
                            disabled={isLoading || !!tokenError} // Disable input if loading or token error
                            className={`flex-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-full text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition ${isLoading || tokenError ? 'opacity-50 cursor-not-allowed' : ''}`}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim() || isLoading || !!tokenError} // Disable button if loading or token error
                            className={`px-5 py-2 rounded-full text-sm font-medium transition ${!inputMessage.trim() || isLoading || tokenError
                                    ? 'bg-violet-800 text-violet-400 cursor-not-allowed opacity-60'
                                    : 'bg-violet-600 text-white hover:bg-violet-500 cursor-pointer'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </> 
                            ) : 'Send'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AcademicChatPage; 