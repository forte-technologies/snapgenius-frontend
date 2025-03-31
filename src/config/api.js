// src/config/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mygenius-f1dc97d5ca0f.herokuapp.com';

// Token handling function
export const getStoredToken = () => localStorage.getItem('auth_token');
export const setStoredToken = (token) => localStorage.setItem('auth_token', token);
export const clearStoredToken = () => localStorage.removeItem('auth_token');

// Check URL for auth code parameter and exchange it for a token
const checkURLForCode = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code) {
    try {
      // Exchange the code for a token
      const response = await axios.get(`${API_BASE_URL}/api/auth/exchange?code=${code}`, {
        withCredentials: true
      });
      
      if (response.data && response.data.token) {
        // Save the token
        setStoredToken(response.data.token);
        
        // Clean URL
        const cleanURL = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, cleanURL);
        
        return response.data.token;
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  }
  return null;
};

export const ENDPOINTS = {
    AUTH: {
        CHECK: `${API_BASE_URL}/api/auth/me`,
        LOGIN: `${API_BASE_URL}/oauth2/authorization/google`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
        TOKEN: `${API_BASE_URL}/api/auth/token`,
        EXCHANGE: `${API_BASE_URL}/api/auth/exchange`,
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

// Initialize by checking for code in URL
// This is an async function but we handle it inside
(async () => {
  try {
    await checkURLForCode();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
})();

export default { ENDPOINTS, apiClient };