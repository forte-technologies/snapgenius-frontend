import { useState, useEffect } from 'react';
// Removed Link import as navigation is handled by parent
import { ENDPOINTS, apiClient } from '../config/api';

// Renamed function and removed outer page structure
function UploadsView() {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const pageSize = 10;

    // Fetching logic remains the same
    useEffect(() => {
        fetchUploads(currentPage, pageSize);
    }, [currentPage]);

    const fetchUploads = async (page, size) => {
        setLoading(true);
        try {
            const response = await apiClient.get(ENDPOINTS.UPLOADS.GET_UPLOADS, {
                params: { page, size }
            });
            
            setUploads(response.data.uploads);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalItems(response.data.totalItems);
            setError(null);
        } catch (err) {
            console.error('Error fetching uploads:', err);
            setError('Failed to load your uploads. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Handlers remain the same
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };
    const handleDeleteClick = (uploadId) => setDeleteConfirm(uploadId);
    const cancelDelete = () => setDeleteConfirm(null);
    const confirmDelete = async (uploadId) => {
        setDeleting(true);
        try {
            await apiClient.delete(ENDPOINTS.UPLOADS.DELETE_UPLOAD(uploadId));
            fetchUploads(currentPage, pageSize); // Refresh after delete
        } catch (err) {
            console.error('Error deleting upload:', err);
            setError('Failed to delete the upload. Please try again.');
        } finally {
            setDeleteConfirm(null);
            setDeleting(false);
        }
    };

    // Helper functions remain the same
    const getFileIcon = (fileType) => {
        const baseClasses = "w-5 h-5 flex-shrink-0";
        if (fileType?.startsWith('image/')) {
            return (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${baseClasses} text-blue-400`}>
                     <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909-.48-1.921a.75.75 0 0 0-1.448-.082L9 12.49l-1.779-1.778a.75.75 0 0 0-1.06 0l-2.97 2.968ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
                 </svg>
            );
        } else if (fileType?.includes('pdf')) {
            return (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${baseClasses} text-red-400`}>
                     <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h5.5a3 3 0 0 1 2.599 1.5H15A.75.75 0 0 1 15.75 6v1.5H12A1.5 1.5 0 0 0 10.5 9v2.25H5.75A.75.75 0 0 1 5 10.5V6Zm3-1.5A1.5 1.5 0 0 0 4.5 6v4.5A1.5 1.5 0 0 0 6 12h5.25a.75.75 0 0 1 0 1.5H6A1.5 1.5 0 0 0 4.5 15v.75a3 3 0 0 0 3 3h5.5a3 3 0 0 0 2.6-1.5H15a.75.75 0 0 0 .75-.75V9.357a3 3 0 0 0-2.121-2.818V6.75A1.5 1.5 0 0 0 12 5.25H7.5A1.5 1.5 0 0 0 6 4.5Z" clipRule="evenodd" />
                 </svg>
            );
        } else if (fileType?.includes('word') || fileType?.includes('doc')) {
            return (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${baseClasses} text-sky-400`}>
                     <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM8.5 5.5a.5.5 0 0 0-.5.5v1.75a.25.25 0 0 0 .25.25h2.5a.25.25 0 0 0 .25-.25V6a.5.5 0 0 0-.5-.5h-2ZM7 10.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5Zm.5 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5Z" clipRule="evenodd" />
                 </svg>
            );
        }
        // Default document icon
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${baseClasses} text-zinc-500`}>
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm4.75 0a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-1a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
        );
    };
    const formatDate = (dateString) => {
         if (!dateString) return '';
         try {
             const date = new Date(dateString);
             return date.toLocaleDateString(undefined, {
                 year: 'numeric', month: 'short', day: 'numeric'
             });
         } catch {
             return '';
         }
    };

    // Removed outer page container and headers
    // Adjusted main container styling for dark theme and embedding
    return (
        <div className="p-4 md:p-6 h-full overflow-y-auto">
            {/* Adjusted card styling */}
            <div className="bg-zinc-800 shadow-lg rounded-lg p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Adjusted text styling */}
                    <h2 className="text-lg font-medium text-zinc-100">All Uploads</h2>
                    {totalItems > 0 && (
                        <span className="text-xs text-zinc-400">
                            {totalItems} {totalItems === 1 ? 'file' : 'files'}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        {/* Adjusted spinner color */}
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-400 text-sm">{error}</div>
                ) : uploads.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400 text-sm">
                        You haven't uploaded any files yet.
                    </div>
                ) : (
                    <>
                        {/* Adjusted list styling */}
                        <div className="divide-y divide-zinc-700">
                            {uploads.map((upload) => (
                                <div key={upload.uploadId} className="py-3 flex items-center justify-between group hover:bg-zinc-700/50 rounded px-2 -mx-2 transition-colors">
                                    <div className="flex items-center flex-1 min-w-0">
                                        {/* Adjusted icon background */}
                                        <div className="h-8 w-8 rounded-md bg-zinc-700 flex items-center justify-center mr-3 flex-shrink-0">
                                            {getFileIcon(upload.fileType)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {/* Adjusted text styling */}
                                            <p className="text-sm font-medium text-zinc-200 truncate max-w-full">
                                                {upload.fileName}
                                            </p>
                                            <p className="text-xs text-zinc-400 truncate">
                                                {formatDate(upload.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {deleteConfirm === upload.uploadId ? (
                                        <div className="flex items-center space-x-2">
                                            {/* Adjusted button styling */}
                                            <button 
                                                onClick={() => confirmDelete(upload.uploadId)}
                                                disabled={deleting}
                                                className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-500 transition disabled:opacity-50"
                                            >
                                                {deleting ? 'Deleting...' : 'Confirm'}
                                            </button>
                                            <button 
                                                onClick={cancelDelete}
                                                className="text-xs px-2 py-1 rounded bg-zinc-600 text-zinc-300 hover:bg-zinc-500 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        // Make delete button always visible on mobile, hover on desktop
                                        <button 
                                            onClick={() => handleDeleteClick(upload.uploadId)}
                                            className="text-xs text-zinc-500 hover:text-red-500 p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                            aria-label="Delete"
                                        >
                                            {/* Adjusted icon color */}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                                 <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                                             </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination controls - Adjusted styling */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${currentPage === 0
                                            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                                            : 'bg-zinc-600 text-zinc-200 hover:bg-zinc-500'
                                    }`}
                                >
                                    Previous
                                </button>
                                
                                <span className="text-xs text-zinc-400">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${currentPage === totalPages - 1
                                            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                                            : 'bg-zinc-600 text-zinc-200 hover:bg-zinc-500'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Renamed export
export default UploadsView; 