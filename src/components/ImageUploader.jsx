import { useState } from 'react';
import { ENDPOINTS, apiClient } from '../config/api';

const ImageUploader = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null);
    };
    
    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }
        
        // Check if file is an image
        if (!selectedFile.type.startsWith('image/')) {
            setError('Only image files are allowed');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await apiClient.post(ENDPOINTS.IMAGES.UPLOAD, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setSelectedFile(null);
            if (onUploadSuccess) {
                onUploadSuccess(response.data);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setError(err.response?.data?.error || 'Failed to upload image');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="image-uploader" style={{ marginBottom: '2rem', padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <h3>Upload Image</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    disabled={isLoading}
                    style={{ flex: 1 }}
                />
                <button 
                    onClick={handleUpload} 
                    disabled={!selectedFile || isLoading}
                    style={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: selectedFile && !isLoading ? 'pointer' : 'not-allowed',
                        opacity: selectedFile && !isLoading ? 1 : 0.7
                    }}
                >
                    {isLoading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            {selectedFile && (
                <div style={{ marginBottom: '0.75rem' }}>
                    <p>Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>
                </div>
            )}
            {error && (
                <div style={{ color: 'red', marginTop: '0.5rem' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ImageUploader; 