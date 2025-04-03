// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import ImageUploader from '../components/ImageUploader';
import ChatInterface from '../components/ChatInterface';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [uploadSuccess, setUploadSuccess] = useState(null);

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate('/');
        }
    };

    const handleUploadSuccess = (data) => {
        setUploadSuccess({
            message: `Successfully uploaded ${data.fileName}`,
            timestamp: data.timestamp
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
            setUploadSuccess(null);
        }, 5000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f9f9fa]">
            {/* iOS-styled status bar for mobile */}
            <div className="h-[44px] bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:hidden">
                <h1 className="font-['Plus_Jakarta_Sans'] font-light text-zinc-800">snapGenius</h1>
                <button 
                    onClick={handleLogout}
                    className="text-xs font-medium text-[#10a37f]"
                >
                    Sign Out
                </button>
            </div>
            
            {/* Main content container with iOS-like padding and max width */}
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 pt-[56px] pb-20 md:py-6 md:px-6">
                {/* Header with logo and logout (visible only on desktop) */}
                <header className="flex justify-between items-center py-4 md:py-6">
                    <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-medium md:text-2xl text-zinc-800 hidden md:block">snapGenius</h1>
                    <button
                        onClick={handleLogout}
                        className="hidden md:block text-sm font-medium px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition shadow-sm"
                    >
                        Sign Out
                    </button>
                </header>

                {/* User profile card */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-6 py-5 mb-6 transition-all duration-300">
                    <h2 className="text-md font-medium text-zinc-800 mb-3">Your Profile</h2>
                    <p className="text-sm text-zinc-600 mb-1 flex items-center justify-between">
                        <span className="font-medium">Email</span>
                        <span className="text-zinc-800">{user?.email}</span>
                    </p>
                    <p className="text-sm text-zinc-600 flex items-center justify-between">
                        <span className="font-medium">Status</span>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            {user?.isAuthenticated ? 'Active' : 'Inactive'}
                        </span>
                    </p>
                </div>

                {/* Success notification */}
                {uploadSuccess && (
                    <div className="fixed top-[56px] inset-x-0 md:top-6 z-20 px-4 pointer-events-none">
                        <div className="bg-black/80 text-white backdrop-blur-md rounded-xl shadow-lg px-4 py-3 mx-auto max-w-sm text-sm font-medium flex justify-between items-center animate-fade-in">
                            <span>{uploadSuccess.message}</span>
                            <span className="text-xs text-white/70 ml-2">
                                {new Date(uploadSuccess.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>
                )}

                {/* Image uploader section */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-6 py-5 mb-6 transition-all duration-300">
                    <h2 className="text-md font-medium text-zinc-800 mb-3">Upload Images</h2>
                    <ImageUploader onUploadSuccess={handleUploadSuccess} />
                </div>
                
                {/* Chat section */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-6 py-5 mb-20 md:mb-6 transition-all duration-300">
                    <h2 className="text-md font-medium text-zinc-800 mb-2">Chat with Your AI Assistant</h2>
                    <p className="text-sm text-zinc-500 mb-4">Ask questions about your uploaded images</p>
                    <ChatInterface />
                </div>
            </div>
            
            {/* iOS-style bottom navigation for mobile */}
            <div className="h-16 bg-white/90 backdrop-blur-md border-t border-zinc-200 fixed bottom-0 left-0 right-0 flex justify-around items-center px-6 md:hidden">
                <button className="flex flex-col items-center justify-center text-[#10a37f]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.03-.028.061-.056.091-.086L12 5.43z" />
                    </svg>
                    <span className="text-xs mt-1">Home</span>
                </button>
                <button className="flex flex-col items-center justify-center text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                    <span className="text-xs mt-1">Profile</span>
                </button>
                <button className="flex flex-col items-center justify-center text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs mt-1">Settings</span>
                </button>
            </div>
        </div>
    );
}

export default Dashboard;