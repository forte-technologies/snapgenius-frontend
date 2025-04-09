import { useState, useRef } from 'react';
import { ENDPOINTS, apiClient } from '../config/api';

const DocumentUploader = ({ onUploadSuccess }) => {
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

        // Check if file is a supported document type
        const supportedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!supportedTypes.includes(selectedFile.type)) {
            setError('Only PDF, DOC, DOCX, and TXT files are supported');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post(ENDPOINTS.DOCUMENTS.UPLOAD, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSelectedFile(null);
            // Reset the file input element to ensure it can be reused
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            if (onUploadSuccess) {
                onUploadSuccess(response.data);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setError(err.response?.data?.error || 'Failed to upload document');
        } finally {
            setIsLoading(false);
        }
    };

    // Get file icon based on document type
    const getFileIcon = () => {
        if (!selectedFile) return null;
        
        if (selectedFile.type === 'application/pdf') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-red-500">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
            );
        } 
        
        if (selectedFile.type.includes('word')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-blue-500">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            );
        }
        
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-zinc-500">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Upload controls */}
            <div className="flex items-center gap-2">
                <label
                    htmlFor="document-upload"
                    className="flex-1 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 py-1.5 px-3 text-xs rounded-md font-medium cursor-pointer transition-colors shadow-sm"
                >
                    {selectedFile ? (
                        <div className="flex items-center">
                            {getFileIcon()}
                            <span className="truncate">{selectedFile.name}</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1.5 text-zinc-500">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            Choose Document
                        </div>
                    )}
                </label>
                <input
                    id="document-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
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

            <div className="text-[11px] text-zinc-400 mt-0.5">
                PDF, DOC, DOCX, TXT
            </div>
        </div>
    );
};

export default DocumentUploader; 