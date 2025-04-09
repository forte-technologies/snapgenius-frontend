import { useState, useRef } from 'react';
import { ENDPOINTS, apiClient } from '../config/api';

const ImageUploader = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
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
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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
        <div className="flex flex-col gap-2">
            {/* Upload controls */}
            <div className="flex items-center gap-2">
                <label
                    htmlFor="image-upload"
                    className="flex-1 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 py-1.5 px-3 text-xs rounded-md font-medium cursor-pointer transition-colors shadow-sm"
                >
                    {selectedFile ? (
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-zinc-500">
                                <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate">{selectedFile.name}</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1.5 text-zinc-500">
                                <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Choose Image
                        </div>
                    )}
                </label>
                <input
                    id="image-upload"
                    type="file"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="hidden"
                    ref={fileInputRef}
                />
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors shadow-sm ${
                        selectedFile && !isLoading
                            ? "bg-[#10a37f] text-white hover:bg-[#0e8f6e]"
                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading
                        </div>
                    ) : "Upload"}
                </button>
            </div>

            {/* File info & error messages */}
            {selectedFile && (
                <div className="text-[11px] text-zinc-600 bg-zinc-50 rounded-md p-1.5 flex justify-between items-center border border-zinc-100">
                    <span className="text-zinc-400 whitespace-nowrap">{Math.round(selectedFile.size / 1024)} KB</span>
                </div>
            )}
            
            {error && (
                <div className="text-[11px] text-red-500 bg-red-50 p-1.5 rounded-md border border-red-100">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ImageUploader; 