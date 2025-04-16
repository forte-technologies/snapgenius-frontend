// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { apiClient, ENDPOINTS } from '../config/api'; // Import apiClient and ENDPOINTS
import ImageUploader from '../components/ImageUploader';
import DocumentUploader from '../components/DocumentUploader';
import PromptDialGroup from '../components/PromptDialGroup'; // Import PromptDialGroup
import UnifiedChatInterface from '../components/UnifiedChatInterface'; // Import the new component

// Import Views
import ChatView from '../views/ChatView';
import UploadsView from '../views/UploadsView';
import SettingsView from '../views/SettingsView';

// Define view modes
const VIEWS = {
    CHAT: 'chat',
    UPLOADS: 'uploads',
    SETTINGS: 'settings',
};

// Define chat modes
const CHAT_MODES = {
  IMAGE: 'image',
  GENERAL: 'general',
  ACADEMIC: 'academic',
};

function Dashboard() {
    const { user, logout, accessToken } = useAuth(); // Get accessToken too
    const navigate = useNavigate();
    
    // State for the Dashboard
    const [currentView, setCurrentView] = useState(VIEWS.CHAT); // Default view is chat
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [activeChatMode, setActiveChatMode] = useState(CHAT_MODES.IMAGE); // Default mode
    const [promptSettings, setPromptSettings] = useState({
        tone: 0.5, complexity: 0.5, focus: 0.5, depth: 0.5, clarity: 0.5,
    });
    const [chatToken, setChatToken] = useState(null);
    const [tokenError, setTokenError] = useState(null);
    
    // Fetch chat token logic (moved from AcademicChatPage)
    useEffect(() => {
        const fetchChatToken = async () => {
            if (!accessToken) {
                setChatToken(null);
                setTokenError('Authentication token not found.');
                return;
            }
            try {
                setTokenError(null); 
                const response = await apiClient.get(ENDPOINTS.CHAT.TOKEN); 
                setChatToken(response.data.token);
                console.log("Chat token fetched successfully for Dashboard.");
            } catch (error) {
                console.error('Dashboard: Error fetching chat token:', error);
                setTokenError('Failed to initialize chat session. Please refresh.');
                setChatToken(null); 
            }
        };
        fetchChatToken();
    }, [accessToken]);

    // Logout Handler
    const handleLogout = async () => {
        const success = await logout();
        if (success) navigate('/');
    };

    // Upload Success Handler (displays temporary notification)
    const handleUploadSuccess = useCallback((data) => {
        setUploadSuccess({ message: `Uploaded ${data.fileName}`, timestamp: data.timestamp });
        setTimeout(() => setUploadSuccess(null), 5000);
        // TODO: Optionally notify the UnifiedChatInterface or trigger a refresh?
    }, []);

    // Component for Desktop Sidebar Chat Mode Buttons
    const DesktopChatModeButton = ({ mode, label }) => (
        <button
            onClick={() => {
                setCurrentView(VIEWS.CHAT); // Ensure chat view is active
                setActiveChatMode(mode);   // Set the specific chat mode
            }}
            // Removed disabled state and styling
            className={`w-full text-left text-sm px-3 py-2 rounded-md transition ${
                activeChatMode === mode && currentView === VIEWS.CHAT // Highlight only if view is Chat AND mode is active
                    ? 'bg-violet-600 text-white font-medium shadow-sm' 
                    : 'text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
            }`}
        >
            {label}
        </button>
    );
    
    // Component for Mobile Bottom Nav Buttons
    const MobileNavLink = ({ view, label, icon }) => (
        <button 
            onClick={() => setCurrentView(view)}
            className={`flex flex-col items-center justify-center pt-1 pb-1 flex-1 transition ${currentView === view ? 'text-violet-400' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
            {icon}
            <span className="text-[10px] mt-0.5">{label}</span>
        </button>
    );

    // Determine main content padding based on mobile/desktop and view
    // Mobile needs padding-top for header, padding-bottom for nav 
    // Desktop needs no extra padding
    const mainContentPadding = `pt-12 pb-16 md:pt-0 md:pb-0`; // Always pt-12, pb-16 on mobile now

    return (
        <div className="relative flex h-screen bg-zinc-900 text-white overflow-hidden">
            
            {/* Re-added Fixed Top Bar (Mobile Only) */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-12 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between px-4 z-20 shadow-sm">
                <h1 className="font-['Plus_Jakarta_Sans'] text-base font-medium text-zinc-100">snapGenius</h1>
                 <div className="flex items-center space-x-3">
                      {/* REMOVED Uploads button/icon */}
                     
                      {/* Replaced Sign Out Icon with Text Button */}
                     <button
                        onClick={handleLogout}
                        className="text-xs font-medium text-zinc-300 hover:text-white bg-zinc-700 hover:bg-zinc-600 px-2.5 py-1 rounded-md transition"
                        title="Sign Out"
                    >
                        Logout
                    </button>
                 </div>
            </header>

            {/* Fixed Sidebar (Desktop Only) */}
            <aside className="hidden md:flex md:flex-col md:w-72 border-r border-zinc-700 p-4 space-y-4 overflow-y-auto bg-zinc-800">
                {/* Sidebar Header */}
                <div className="flex justify-between items-center">
                    <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-medium text-zinc-100">snapGenius</h1>
                     <button
                        onClick={handleLogout}
                        className="text-xs px-2 py-1 rounded border border-zinc-600 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition"
                        title="Sign Out"
                    >
                        Sign Out
                    </button>
                </div>

                {/* User Info */}
                 <div className="text-xs text-zinc-400 border-t border-b border-zinc-700 py-2">
                    Logged in as: <span className="font-medium text-zinc-300">{user?.email}</span>
                 </div>

                {/* Navigation/Mode Controls */}
                <nav className="space-y-1">
                    {/* Chat Mode Toggles (only functional when chat view is active) */}
                    <DesktopChatModeButton mode={CHAT_MODES.IMAGE} label="Image Chat" />
                    <DesktopChatModeButton mode={CHAT_MODES.GENERAL} label="General Chat" />
                    <DesktopChatModeButton mode={CHAT_MODES.ACADEMIC} label="Academic AI" />
                    {/* Separator */}
                    <div className="pt-2 border-t border-zinc-700/50 !mt-3"></div> 
                     {/* View Toggles */}
                     <button onClick={() => setCurrentView(VIEWS.UPLOADS)} className={`w-full text-left text-sm px-3 py-2 rounded-md transition ${currentView === VIEWS.UPLOADS ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'}`}>View Uploads</button>
                     <button onClick={() => setCurrentView(VIEWS.SETTINGS)} className={`w-full text-left text-sm px-3 py-2 rounded-md transition ${currentView === VIEWS.SETTINGS ? 'bg-zinc-600 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'}`}>Settings</button>
                 </nav>

                 {/* Conditional Prompt Tuner (Shows only if view is chat AND mode is academic) */}
                 {currentView === VIEWS.CHAT && activeChatMode === CHAT_MODES.ACADEMIC && (
                     <div className="border-t border-zinc-700 pt-4">
                         <PromptDialGroup 
                             settings={promptSettings} 
                             onSettingsChange={setPromptSettings} 
                         />
                     </div>
                 )}

                 {/* Uploaders Section */}
                 <div className="border-t border-zinc-700 pt-4 mt-auto space-y-3"> {/* mt-auto pushes to bottom */}
                      <h3 className="text-sm font-medium text-zinc-200 mb-1">Upload New Files</h3>
                       <ImageUploader onUploadSuccess={handleUploadSuccess} />
                       <DocumentUploader onUploadSuccess={handleUploadSuccess} />
                 </div>

                 {/* Display Token Error */}
                 {tokenError && (
                    <div className="mt-2 p-2 bg-red-800 text-red-100 text-xs rounded border border-red-600 text-center">
                        {tokenError}
                    </div>
                 )}
            </aside>

            {/* Main Content Area - Updated Padding */}
            <main className={`flex-1 flex flex-col bg-zinc-900 overflow-hidden ${mainContentPadding}`}>
                {currentView === VIEWS.CHAT && (
                     <ChatView 
                        key={activeChatMode} 
                        activeChatMode={activeChatMode}
                        setActiveChatMode={setActiveChatMode} 
                        promptSettings={promptSettings}
                        setPromptSettings={setPromptSettings}
                        chatToken={chatToken}
                        tokenError={tokenError}
                        onUploadSuccess={handleUploadSuccess}
                    />
                )}
                {currentView === VIEWS.UPLOADS && <UploadsView />}
                {currentView === VIEWS.SETTINGS && <SettingsView user={user} />}
            </main>
            
            {/* Mobile Bottom Navigation - Updated padding logic */}
            {/* The pb adjustment might need tweaking based on actual chat controls height */}
             <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-800 border-t border-zinc-700 flex justify-around items-stretch z-30 pb-[env(safe-area-inset-bottom)]`}>
                 <MobileNavLink 
                     view={VIEWS.CHAT} 
                     label="Chat" 
                     icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 5.25A3.25 3.25 0 0 1 5.25 2h9.5A3.25 3.25 0 0 1 18 5.25v9.5A3.25 3.25 0 0 1 14.75 18h-9.5A3.25 3.25 0 0 1 2 14.75v-9.5ZM5.25 4a1.75 1.75 0 0 0-1.75 1.75v.537l6.06 3.636a.75.75 0 0 0 .78 0l6.06-3.636V6.75a.25.25 0 0 1 .25-.25h.5a.75.75 0 0 1 0 1.5h-.5a1.75 1.75 0 0 0-1.75-1.75H5.25Z" clipRule="evenodd" /></svg>}
                 />
                 <MobileNavLink 
                    view={VIEWS.UPLOADS} 
                    label="Uploads" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.12a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" /><path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" /></svg>}
                />
                <MobileNavLink 
                    view={VIEWS.SETTINGS} 
                    label="Settings" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.84 1.804a1 1 0 0 1 1.07.158l1.46 1.46a1 1 0 0 0 1.346-.056l1.578-1.578a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1 0 1.414l-1.578 1.578a1 1 0 0 0-.056 1.346l1.46 1.46a1 1 0 0 1 .158 1.07l-.816 1.836a1 1 0 0 1-1.02.654l-1.98-.264a1 1 0 0 0-1.103.42l-1.34 1.608a1 1 0 0 1-1.256 0l-1.34-1.608a1 1 0 0 0-1.103-.42l-1.98.264a1 1 0 0 1-1.02-.654l-.816-1.836a1 1 0 0 1 .158-1.07l1.46-1.46a1 1 0 0 0-.056-1.346l-1.578-1.578a1 1 0 0 1 0-1.414L4.05 3.374a1 1 0 0 1 1.414 0l1.578 1.578a1 1 0 0 0 1.346.056l1.46-1.46a1 1 0 0 1 .158-1.07l.816-1.836Zm.97 10.29a2.196 2.196 0 1 0 0-4.392 2.196 2.196 0 0 0 0 4.392Z" clipRule="evenodd" /></svg>}
                />
            </nav>

            {/* Success Notification */}
            {uploadSuccess && (
                <div className="fixed top-6 right-6 z-20 pointer-events-none">
                    <div className="bg-black/80 text-white backdrop-blur-md rounded-xl shadow-lg px-4 py-3 max-w-sm text-sm font-medium flex justify-between items-center animate-fade-in">
                        <span>{uploadSuccess.message}</span>
                        <span className="text-xs text-white/70 ml-2">
                            {new Date(uploadSuccess.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;