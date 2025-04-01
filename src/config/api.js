// src/config/api.js
import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://mygenius-f1dc97d5ca0f.herokuapp.com";

export const ENDPOINTS = {
    AUTH: {
        CHECK: `${API_BASE_URL}/api/auth/me`,
        LOGIN: `${API_BASE_URL}/oauth2/authorization/google`,
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
};

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the token automatically
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default { ENDPOINTS, apiClient };
