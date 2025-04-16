import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import { apiClient, ENDPOINTS } from '../config/api'; // Need endpoints
import { streamChatResponse } from '../services/academicChatService'; // Use the renamed, generalized service function
import PromptDialGroup from './PromptDialGroup'; // Import PromptDialGroup for the modal

// Define chat modes (can be shared or redefined)
const CHAT_MODES = {
    IMAGE: 'image',
    GENERAL: 'general',
    ACADEMIC: 'academic',
};

// Helper to format timestamp (similar to AcademicChatPage)
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

// Map chat modes to their corresponding stream endpoints
const modeToEndpoints = {
    image: ENDPOINTS.CHAT.MICRO_STRICT_RAG_STREAM,
    general: ENDPOINTS.CHAT.MICRO_GENERAL_STREAM,
    academic: ENDPOINTS.CHAT.MICRO_GENERAL_ACADEMIC_STREAM,
};

function UnifiedChatInterface({ 
    activeChatMode,
    setActiveChatMode, // Receive setter from Dashboard
    promptSettings,
    setPromptSettings, // Receive setter from Dashboard
    chatToken, 
    tokenError,
    onUploadSuccess     // Receive callback from Dashboard
}) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // State for upload loading
    const [streamingMessage, setStreamingMessage] = useState('');
    const [isTunerOpen, setIsTunerOpen] = useState(false); // State for tuner modal
    const [isUploadOptionsOpen, setIsUploadOptionsOpen] = useState(false); // <-- Add state for upload modal
    const messagesEndRef = useRef(null);
    const activeStreamRef = useRef(null); // To manage stopping the stream
    const imageInputRef = useRef(null); // Ref for hidden image input
    const documentInputRef = useRef(null); // Ref for hidden document input

    // Clear messages when chat mode changes
    useEffect(() => {
        setMessages([]);
        setStreamingMessage('');
        setIsLoading(false); // Reset loading state
        setIsUploading(false); // Reset uploading state
        setIsTunerOpen(false); // Close tuner modal on mode change
        setIsUploadOptionsOpen(false); // Close upload options modal on mode change
        if (activeStreamRef.current) {
             activeStreamRef.current = false; 
        }
    }, [activeChatMode]);

    // Scroll to bottom effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingMessage]);

    // Cleanup ongoing stream on unmount
    useEffect(() => {
        return () => {
            activeStreamRef.current = null; 
        };
    }, []);

    const handleInputChange = (e) => setInputMessage(e.target.value);

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading || !chatToken || tokenError || isUploading) return;

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
        setStreamingMessage(''); 
        
        activeStreamRef.current = true; 
        let fullMessage = '';
        
        const endpoint = modeToEndpoints[activeChatMode];
        const payload = activeChatMode === CHAT_MODES.ACADEMIC 
            ? { message: userMessageText, promptSettings }
            : { message: userMessageText };

        try {
            // Call the generalized streamChatResponse function
            const stream = streamChatResponse(endpoint, payload, chatToken);

            for await (const chunk of stream) {
                if (!activeStreamRef.current) { 
                    console.log('Stream processing stopped.');
                    break;
                }
                fullMessage += chunk;
                setStreamingMessage(fullMessage);
            }

            if (fullMessage && activeStreamRef.current) {
                const aiMessage = {
                    id: Date.now() + 1, 
                    text: fullMessage,
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                };
                // Check if the message is an error message from the stream itself
                // Note: The service now throws errors, so this check might be less necessary
                // depending on how errors are handled in the catch block.
                // if (fullMessage.toLowerCase().includes('sorry, i encountered an error')) {
                //     aiMessage.isError = true;
                // }
                setMessages((prev) => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error(`Error handling ${activeChatMode} stream:`, error);
            const errorText = error?.message?.includes('status: 401')
                ? 'Chat authentication failed. Please refresh.'
                : `Sorry, I encountered an error during the ${activeChatMode} chat. Please try again.`;
            setMessages((prev) => [...prev, { id: Date.now() + 1, text: errorText, sender: 'ai', isError: true, timestamp: new Date().toISOString() }]);
        } finally {
            if (activeStreamRef.current) { 
                setIsLoading(false);
                setStreamingMessage('');
                activeStreamRef.current = false; 
            }
        }
    }, [inputMessage, isLoading, chatToken, promptSettings, activeChatMode, tokenError, isUploading]);

    // Generic file upload handler for mobile button
    const handleFileUpload = async (event, fileType) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        
        const endpoint = fileType === 'image' ? ENDPOINTS.IMAGES.UPLOAD : ENDPOINTS.DOCUMENTS.UPLOAD;
        
        setIsUploading(true); // Show uploading state
        setMessages(prev => [...prev, { id: Date.now(), text: `Uploading ${file.name}...`, sender: 'system', timestamp: new Date().toISOString() }]);

        try {
            // Use apiClient directly for upload (needs main auth token)
            const response = await apiClient.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (onUploadSuccess) {
                onUploadSuccess(response.data); // Notify parent (Dashboard)
            }
            // Remove the "Uploading..." message or update it
            setMessages(prev => prev.filter(msg => !msg.text.startsWith('Uploading'))); 
        } catch (err) {
            console.error(`Upload failed for ${fileType}:`, err);
            const errorMsg = err.response?.data?.error || `Failed to upload ${fileType}`;
            // Show error message in chat
            setMessages(prev => [...prev.filter(msg => !msg.text.startsWith('Uploading')), {
                 id: Date.now(), text: `Upload Error: ${errorMsg}`, sender: 'ai', isError: true, timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsUploading(false);
             // Reset the specific file input
             if (fileType === 'image' && imageInputRef.current) imageInputRef.current.value = '';
             if (fileType === 'document' && documentInputRef.current) documentInputRef.current.value = '';
        }
    };

    // Placeholder message based on mode
    const getPlaceholder = () => {
        if (tokenError) return "Chat unavailable due to connection error";
        if (isUploading) return "Uploading file...";
        switch (activeChatMode) {
            case 'image': return "Ask about your uploaded images...";
            case 'general': return "Ask me anything (general knowledge)...";
            case 'academic': return "Ask an academic question (use dials to tune)...";
            default: return "Type your message...";
        }
    };

    // Mobile Mode Toggle Button Component
    const MobileModeButton = ({ mode, label }) => (
        <button
            onClick={() => setActiveChatMode(mode)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                activeChatMode === mode ? 'bg-violet-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
            }`}
        >
            {label}
        </button>
    );

    // --- Render Markdown Components with Basic Styling ---
    const markdownComponents = {
        h1: ({...props}) => <h1 className="text-xl font-semibold mt-4 mb-2" {...props} />,
        h2: ({...props}) => <h2 className="text-lg font-semibold mt-3 mb-1.5" {...props} />,
        h3: ({...props}) => <h3 className="text-base font-semibold mt-2 mb-1" {...props} />,
        ul: ({...props}) => <ul className="list-disc list-outside my-2 pl-5" {...props} />,
        ol: ({...props}) => <ol className="list-decimal list-outside my-2 pl-5" {...props} />,
        li: ({...props}) => <li className="mb-1.5" {...props} />,
        p: ({...props}) => <p className="mb-2" {...props} />,
        strong: ({...props}) => <strong className="font-semibold" {...props} />,
        em: ({...props}) => <em className="italic" {...props} />,
        code: ({inline, className, children, ...props}) => {
            return !inline ? (
                <pre className="bg-zinc-700/50 p-2 rounded-md my-2 text-xs overflow-x-auto">
                    <code className={`${className}`} {...props}>
                        {String(children).replace(/\n$/, '')}
                    </code>
                </pre>
            ) : (
                <code className={`bg-zinc-600 px-1 py-0.5 rounded text-xs ${className}`} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900 text-white">
            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {messages.length === 0 && !streamingMessage && (
                    <div className="text-center text-zinc-500 pt-10 px-4">
                         {activeChatMode === CHAT_MODES.IMAGE && "Start a conversation about your uploaded images! Use the buttons below to upload or switch modes."}
                         {activeChatMode === CHAT_MODES.GENERAL && "Ask me anything! Use the buttons below to switch modes."}
                         {activeChatMode === CHAT_MODES.ACADEMIC && "Ask an academic question. Use the buttons below to tune the response, upload files, or switch modes."}
                    </div>
                )}
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] text-sm p-3 rounded-lg shadow-sm ${message.sender === 'user'
                                    ? 'bg-violet-600 text-white rounded-br-none'
                                    : message.isError
                                        ? 'bg-red-800 text-red-100 rounded-bl-none'
                                        : message.sender === 'system' // System messages from uploads
                                            ? 'bg-zinc-700 text-zinc-300 text-center w-full max-w-none rounded-md italic text-xs py-2'
                                            : 'bg-zinc-700 text-zinc-100 rounded-bl-none' // AI message style
                                }`}
                        >
                            <ReactMarkdown components={markdownComponents}>
                                {message.text}
                            </ReactMarkdown>
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
                        <div className="max-w-[75%] bg-zinc-700 text-zinc-100 text-sm p-3 rounded-lg rounded-bl-none shadow-sm animate-pulse">
                            <ReactMarkdown components={markdownComponents}>
                                {streamingMessage}
                            </ReactMarkdown>
                            <div className="text-xs text-zinc-400 mt-1.5 text-right flex items-center justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block mr-1.5 animate-ping"></span>
                                Typing...
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
            </div>

            {/* Input Area & Mobile Controls */}
            {/* REMOVED fixed positioning for mobile, Add margin-top for spacing */}
            <div className="mt-auto border-t border-zinc-700 bg-zinc-800 p-2 md:p-4 md:relative">
                {/* Mobile-Only Mode Switcher - Centered */}
                 <div className="md:hidden flex justify-center items-center gap-2 mb-2 px-2">
                    <MobileModeButton mode={CHAT_MODES.IMAGE} label="Image" />
                    <MobileModeButton mode={CHAT_MODES.GENERAL} label="General" />
                    <MobileModeButton mode={CHAT_MODES.ACADEMIC} label="Academic" />
                 </div>

                {/* Main Input Form */}
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 md:gap-3"
                >
                    {/* Mobile Upload Button - Changed onClick */}
                    <button 
                        type="button"
                        onClick={() => setIsUploadOptionsOpen(true)} // <-- Open the modal
                        className="md:hidden p-2 text-zinc-400 hover:text-zinc-200 transition"
                        title="Upload Document or Image"
                        disabled={isLoading || isUploading}
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" /></svg>
                    </button>
                     {/* Hidden File Inputs */}
                     <input type="file" ref={imageInputRef} onChange={(e) => handleFileUpload(e, 'image')} className="hidden" accept="image/*" />
                     <input type="file" ref={documentInputRef} onChange={(e) => handleFileUpload(e, 'document')} className="hidden" accept=".pdf,.doc,.docx,.txt" /> {/* Adjust accept as needed */}

                    {/* Mobile Tune Button */}
                    {activeChatMode === CHAT_MODES.ACADEMIC && (
                        <button 
                            type="button"
                            onClick={() => setIsTunerOpen(true)}
                            className="md:hidden p-2 text-zinc-400 hover:text-zinc-200 transition"
                            title="Tune Prompt Settings"
                            disabled={isLoading || isUploading}
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3.75a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM10 8.75a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM10 13.75a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></svg>
                        </button>
                    )}
                    
                    {/* Text Input */}
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={handleInputChange}
                        placeholder={getPlaceholder()} 
                        disabled={isLoading || !!tokenError || !chatToken || isUploading} 
                        className={`flex-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-full text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition ${isLoading || tokenError || !chatToken || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        autoFocus
                    />
                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading || !!tokenError || !chatToken || isUploading}
                        className={`px-4 py-2 md:px-5 rounded-full text-sm font-medium transition ${!inputMessage.trim() || isLoading || tokenError || !chatToken || isUploading
                                ? 'bg-violet-800 text-violet-400 cursor-not-allowed opacity-60'
                                : 'bg-violet-600 text-white hover:bg-violet-500 cursor-pointer'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="hidden md:inline ml-2">Sending...</span>
                            </> 
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 md:hidden">
                                    <path d="M3.105 13.105a.75.75 0 0 0 1.06.053l4.009-3.007a.75.75 0 0 1 .97 0l4.009 3.007a.75.75 0 0 0 1.113-1.006l-4.5-6a.75.75 0 0 0-.97 0l-4.5 6a.75.75 0 0 0-.053 1.06Z" />
                                </svg> 
                                <span className="hidden md:inline">Send</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Prompt Tuner Modal */}
            {isTunerOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 md:hidden"
                    onClick={() => setIsTunerOpen(false)} // Close on backdrop click
                >
                    <div 
                        className="bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-sm border border-zinc-700"
                        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-zinc-100">Tune Response</h3>
                             <button onClick={() => setIsTunerOpen(false)} className="text-zinc-400 hover:text-zinc-100">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
                             </button>
                         </div>
                         <PromptDialGroup 
                            settings={promptSettings} 
                            onSettingsChange={setPromptSettings} 
                        />
                    </div>
                </div>
            )}

            {/* Upload Options Modal */}
            {isUploadOptionsOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:hidden"
                    onClick={() => setIsUploadOptionsOpen(false)} // Close on backdrop click
                >
                    <div 
                        className="bg-zinc-800 p-4 rounded-lg shadow-xl w-full max-w-[280px] border border-zinc-700 space-y-3"
                        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <h4 className="text-sm font-medium text-zinc-200 text-center mb-3">Upload Type</h4>
                        <button 
                            onClick={() => {
                                imageInputRef.current?.click();
                                setIsUploadOptionsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-100 transition text-sm"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2ZM2 1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2Zm6.09 7.59a.75.75 0 0 0-1.08 1.04l.018.018 2.25 2.25a.75.75 0 0 0 1.06 0l4.5-4.5a.75.75 0 1 0-1.06-1.06L8.5 10.94l-1.41-1.41Z" clipRule="evenodd" /></svg>
                            Upload Image
                        </button>
                        <button 
                            onClick={() => {
                                documentInputRef.current?.click();
                                setIsUploadOptionsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-100 transition text-sm"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 1.75a.75.75 0 0 1 .75.75V4h3.25a.75.75 0 0 1 0 1.5H4.75v8.5a.75.75 0 0 1-1.5 0V2.5A.75.75 0 0 1 4 1.75Zm5.75.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-1.5 0V2.5h-2.25a.75.75 0 0 1 0-1.5Z" clipRule="evenodd" /></svg>
                            Upload Document
                        </button>
                         <button 
                            onClick={() => setIsUploadOptionsOpen(false)}
                            className="w-full mt-4 px-3 py-1.5 rounded-md bg-zinc-600 hover:bg-zinc-500 text-zinc-200 transition text-xs"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

UnifiedChatInterface.propTypes = {
    activeChatMode: PropTypes.oneOf(['image', 'general', 'academic']).isRequired,
    setActiveChatMode: PropTypes.func.isRequired, // Add prop type
    promptSettings: PropTypes.object.isRequired,
    setPromptSettings: PropTypes.func.isRequired, // Add prop type
    chatToken: PropTypes.string, // Can be null initially
    tokenError: PropTypes.string, // Can be null
    onUploadSuccess: PropTypes.func.isRequired // Add prop type
};

export default UnifiedChatInterface; 