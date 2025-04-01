// src/contexts/AuthProvider.js
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ENDPOINTS, apiClient } from '../config/api';
import { AuthContext } from './useAuth';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            localStorage.setItem('access_token', tokenFromUrl);
            // Remove token from URL
            navigate(location.pathname, { replace: true });
        }
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await apiClient.get(ENDPOINTS.AUTH.CHECK, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setError(null);
        } catch (error) {
            console.error('Not authenticated', error);
            setUser(null);
            setError('Authentication failed');
            localStorage.removeItem('access_token');
        } finally {
            setLoading(false);
        }
    };

    const login = () => {
        // Redirect to backend OAuth2 endpoint
        window.location.href = ENDPOINTS.AUTH.LOGIN;
    };

    const logout = async () => {
        localStorage.removeItem('access_token');
        setUser(null);
        return true;
    };

    const refreshUser = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No token');
        try {
            const response = await apiClient.get(ENDPOINTS.AUTH.CHECK, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Error refreshing user data', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        accessToken: localStorage.getItem('access_token'),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
