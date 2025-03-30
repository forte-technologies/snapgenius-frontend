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
        <div className="dashboard-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>My Genius</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </header>

            <div className="user-info" style={{ backgroundColor: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h2>Your Profile</h2>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Authentication Status:</strong> {user?.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
            </div>

            {uploadSuccess && (
                <div style={{ 
                    backgroundColor: '#e8f5e9', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '4px', 
                    marginBottom: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{uploadSuccess.message}</span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                        {new Date(uploadSuccess.timestamp).toLocaleTimeString()}
                    </span>
                </div>
            )}

            <ImageUploader onUploadSuccess={handleUploadSuccess} />
            
            <div className="content" style={{ marginBottom: '2rem' }}>
                <h2>Chat with Your AI Assistant</h2>
                <p style={{ marginBottom: '1rem' }}>Ask questions about the images you've uploaded. Your AI assistant will use its knowledge of your images to answer!</p>
                <ChatInterface />
            </div>
        </div>
    );
}

export default Dashboard;