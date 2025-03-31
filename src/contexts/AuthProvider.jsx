import { useState, useEffect } from 'react';
import { ENDPOINTS, apiClient } from '../config/api';
import { AuthContext } from './useAuth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is authenticated on initial load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await apiClient.get(ENDPOINTS.AUTH.CHECK);
                setUser(response.data);
                setError(null);
            } catch (error) {
                console.log('Not authenticated', error);
                setUser(null);
                setError('Authentication failed');
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