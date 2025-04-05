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
        <div className="w-full border border-dashed border-zinc-300 rounded-xl p-4 mb-4">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                    <label
                        htmlFor="file-upload"
                        className="flex-1 w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-2 px-4 rounded-lg text-sm font-medium text-center cursor-pointer transition"
                    >
                        {selectedFile ? selectedFile.name : "Choose Image"}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="hidden"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || isLoading}
                        className={`w-full md:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedFile && !isLoading
                                ? "bg-[#10a37f] text-white hover:bg-[#0e8f6e]"
                                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                        }`}
                    >
                        {isLoading ? "Uploading..." : "Upload"}
                    </button>
                </div>


                {selectedFile && (
                    <div className="text-xs text-zinc-600 bg-zinc-50 rounded-lg p-2 flex justify-between items-center">
                        <span className="truncate">{selectedFile.name}</span>
                        <span className="text-zinc-400 ml-2 whitespace-nowrap">({Math.round(selectedFile.size / 1024)} KB)</span>
                    </div>
                )}
                
                {error && (
                    <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader; 