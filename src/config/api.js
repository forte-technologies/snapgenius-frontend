import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mygenius-f1dc97d5ca0f.herokuapp.com';

export const ENDPOINTS = {
    AUTH: {
        CHECK: `${API_BASE_URL}/api/auth/me`,
        LOGIN: `${API_BASE_URL}/oauth2/authorization/google`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
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

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export default { ENDPOINTS, apiClient };