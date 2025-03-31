import { useState, useEffect } from 'react';
import { ENDPOINTS, apiClient, getStoredToken, setStoredToken, clearStoredToken } from '../config/api';
import { AuthContext } from './useAuth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is authenticated on initial load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // First try with cookies/stored token
                const response = await apiClient.get(ENDPOINTS.AUTH.CHECK);
                setUser(response.data);
                setError(null);
            } catch (error) {
                console.log('Initial auth check failed, trying token endpoint...');
                
                // If we have a token stored but cookie failed, try to get a refreshed session
                if (getStoredToken()) {
                    try {
                        // Get a fresh token using the stored one (via Authorization header)
                        const tokenResponse = await apiClient.get(ENDPOINTS.AUTH.TOKEN);
                        setStoredToken(tokenResponse.data.token);
                        
                        // Try auth check again
                        const refreshedResponse = await apiClient.get(ENDPOINTS.AUTH.CHECK);
                        setUser(refreshedResponse.data);
                        setError(null);
                    } catch (tokenError) {
                        console.error('Token refresh failed', tokenError);
                        clearStoredToken();
                        setUser(null);
                        setError('Authentication failed');
                    }
                } else {
                    setUser(null);
                    setError('Authentication failed');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function - redirect to Google OAuth
    const login = () => {
        window.location.href = ENDPOINTS.AUTH.LOGIN;
    };

    // Logout function
    const logout = async () => {
        try {
            await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
            clearStoredToken();
            setUser(null);
            return true;
        } catch (error) {
            console.error('Error during logout', error);
            return false;
        }
    };

    // Refresh user data
    const refreshUser = async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.AUTH.CHECK);
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Error refreshing user data', error);
            throw error;
        }
    };

    // Context value
    const value = {
        user,
        loading,
        error,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;