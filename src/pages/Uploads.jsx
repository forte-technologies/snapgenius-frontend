import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ENDPOINTS, apiClient } from '../config/api';

function Uploads() {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const pageSize = 10;

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

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteClick = (uploadId) => {
        setDeleteConfirm(uploadId);
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const confirmDelete = async (uploadId) => {
        setDeleting(true);
        try {
            await apiClient.delete(ENDPOINTS.UPLOADS.DELETE_UPLOAD(uploadId));
            // Refresh the list
            fetchUploads(currentPage, pageSize);
            // Show success toast or message if needed
        } catch (err) {
            console.error('Error deleting upload:', err);
            setError('Failed to delete the upload. Please try again.');
        } finally {
            setDeleteConfirm(null);
            setDeleting(false);
        }
    };

    // Get appropriate icon based on file type
    const getFileIcon = (fileType) => {
        if (fileType?.startsWith('image/')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-zinc-500">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                </svg>
            );
        } else if (fileType?.includes('pdf')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                    <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm5.845 17.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V12a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clipRule="evenodd" />
                </svg>
            );
        } else if (fileType?.includes('word') || fileType?.includes('doc')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
                    <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm6.905 9.97a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72V18a.75.75 0 001.5 0v-4.19l1.72 1.72a.75.75 0 101.06-1.06l-3-3z" clipRule="evenodd" />
                </svg>
            );
        }
        
        // Default document icon
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-zinc-500">
                <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875H18.75a1.875 1.875 0 001.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875A1.875 1.875 0 0112.75 7.125V5.25A3.75 3.75 0 009 1.5z" clipRule="evenodd" />
            </svg>
        );
    };

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return '';
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f9f9fa]">
            {/* iOS-styled status bar for mobile */}
            <div className="h-[44px] bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:hidden">
                <h1 className="font-['Plus_Jakarta_Sans'] font-light text-zinc-800">snapGenius</h1>
                <Link to="/dashboard" className="text-xs font-medium text-[#10a37f]">
                    Back to Dashboard
                </Link>
            </div>
            
            {/* Main content container with iOS-like padding and max width */}
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 pt-[56px] pb-20 md:py-6 md:px-6">
                {/* Header with title and back button (visible only on desktop) */}
                <header className="flex justify-between items-center py-4 md:py-6">
                    <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-medium md:text-2xl text-zinc-800 hidden md:block">Your Uploads</h1>
                    <Link
                        to="/dashboard"
                        className="hidden md:block text-sm font-medium px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition shadow-sm"
                    >
                        Back to Dashboard
                    </Link>
                </header>

                {/* Uploads list */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-6 py-5 mb-6 transition-all duration-300">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-md font-medium text-zinc-800">All Uploads</h2>
                        {totalItems > 0 && (
                            <span className="text-xs text-zinc-500">
                                {totalItems} {totalItems === 1 ? 'file' : 'files'}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10a37f]"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500 text-sm">{error}</div>
                    ) : uploads.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 text-sm">
                            You haven't uploaded any files yet.
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-zinc-100">
                                {uploads.map((upload) => (
                                    <div key={upload.uploadId} className="py-3 flex items-center justify-between group hover:bg-zinc-50 rounded px-2 -mx-2 transition-colors">
                                        <div className="flex items-center flex-1 min-w-0">
                                            <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center mr-3 flex-shrink-0">
                                                {getFileIcon(upload.fileType)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-zinc-800 truncate max-w-full">
                                                    {upload.fileName}
                                                </p>
                                                <p className="text-xs text-zinc-500 truncate">
                                                    {formatDate(upload.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {deleteConfirm === upload.uploadId ? (
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => confirmDelete(upload.uploadId)}
                                                    disabled={deleting}
                                                    className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                                                >
                                                    {deleting ? 'Deleting...' : 'Confirm'}
                                                </button>
                                                <button 
                                                    onClick={cancelDelete}
                                                    className="text-xs px-2 py-1 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleDeleteClick(upload.uploadId)}
                                                className="text-xs text-zinc-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            currentPage === 0
                                                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    
                                    <span className="text-sm text-zinc-600">
                                        Page {currentPage + 1} of {totalPages}
                                    </span>
                                    
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages - 1}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            currentPage === totalPages - 1
                                                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
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
            
            {/* iOS-style bottom navigation for mobile */}
            <div className="h-16 bg-white/90 backdrop-blur-md border-t border-zinc-200 fixed bottom-0 left-0 right-0 flex justify-around items-center px-6 md:hidden">
                <Link to="/dashboard" className="flex flex-col items-center justify-center text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.03-.028.061-.056.091-.086L12 5.43z" />
                    </svg>
                    <span className="text-xs mt-1">Home</span>
                </Link>
                <div className="flex flex-col items-center justify-center text-[#10a37f]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                    <span className="text-xs mt-1">Uploads</span>
                </div>
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

export default Uploads; 