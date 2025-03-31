// src/config/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mygenius-f1dc97d5ca0f.herokuapp.com';

// Token handling function
const getStoredToken = () => localStorage.getItem('auth_token');
const setStoredToken = (token) => localStorage.setItem('auth_token', token);
const clearStoredToken = () => localStorage.removeItem('auth_token');

// Check URL for token parameter (for OAuth redirect)
const checkURLForToken = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    setStoredToken(token);
    // Clean URL
    const cleanURL = window.location.href.split('?')[0];
    window.history.replaceState({}, document.title, cleanURL);
    return token;
  }
  return null;
};

export const ENDPOINTS = {
    AUTH: {
        CHECK: `${API_BASE_URL}/api/auth/me`,
        LOGIN: `${API_BASE_URL}/oauth2/authorization/google`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
        TOKEN: `${API_BASE_URL}/api/auth/token`,
    },
    USER: {
        PROFILE: `${API_BASE_URL}/api/user/profile`,
    },
    IMAGES: {
        UPLOAD: `${API_BASE_URL}/api/user/images`,
    },
    CHAT: {
        RAG: `${API_BASE_URL}/api/user/chat/rag`,
    },
    // Add more endpoint categories as needed
};

// Create Axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,  // Keep this for cookie support where available
});

// Add token to all requests if available
apiClient.interceptors.request.use(config => {
    const token = getStoredToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Extract token from responses when available
apiClient.interceptors.response.use(
    response => {
        // Check for token in headers
        const authHeader = response.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            setStoredToken(token);
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

// Check for token in URL (during initialization)
checkURLForToken();

export default { 
    ENDPOINTS, 
    apiClient,
    getStoredToken,
    setStoredToken,
    clearStoredToken
};