import { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS, apiClient } from '../config/api';
import { AuthContext } from './useAuth';

// Token storage key
const TOKEN_STORAGE_KEY = 'mygenius_auth_token';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Process and store token
    const processToken = useCallback((token) => {
        // Store token in sessionStorage
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
        // Update axios default headers
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }, []);

    // Check if user is authenticated on initial load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if we have a token in sessionStorage
                const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
                
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }
                
                // Set token in header for subsequent requests
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Validate token with backend
                try {
                    const validationResponse = await apiClient.post(
                        ENDPOINTS.AUTH.VALIDATE_TOKEN, 
                        { token }
                    );
                    
                    // If token was refreshed, update storage
                    if (validationResponse.data.tokenRefreshed && validationResponse.data.token) {
                        processToken(validationResponse.data.token);
                    }
                    
                    setUser(validationResponse.data);
                    setError(null);
                } catch (validationError) {
                    console.error('Token validation failed', validationError);
                    // Clear invalid token
                    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
                    delete apiClient.defaults.headers.common['Authorization'];
                    setUser(null);
                    setError('Session expired');
                }
            } catch (error) {
                console.error('Auth check failed', error);
                setUser(null);
                setError('Authentication failed');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [processToken]);

    // Login function - redirect to Google OAuth
    const login = () => {
        window.location.href = ENDPOINTS.AUTH.LOGIN;
    };

    // Logout function
    const logout = async () => {
        try {
            await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
            // Clear token from sessionStorage
            sessionStorage.removeItem(TOKEN_STORAGE_KEY);
            // Remove auth header
            delete apiClient.defaults.headers.common['Authorization'];
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
        processToken,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;