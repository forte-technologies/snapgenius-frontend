// src/config/api.js
import axios from "axios";


const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://server.snapgenius.app";


// Chat microservice URL - defaults to localhost in dev, can be overridden with env var
const CHAT_MICROSERVICE_URL =
    import.meta.env.VITE_CHAT_MICROSERVICE_URL || "http://localhost:7050";


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
        FILE_NAMES:`${API_BASE_URL}/api/user/images/imageFileNames`
    },
    DOCUMENTS: {
      UPLOAD:`${API_BASE_URL}/api/user/documents`
    },
    CHAT: {
        RAG: `${API_BASE_URL}/api/user/chat/rag`,
        TOKEN: `${API_BASE_URL}/api/user/chat/token/token`,
        STREAM: `${CHAT_MICROSERVICE_URL}/api/chat/stream`,
        MICRO_GENERAL_STREAM: `${CHAT_MICROSERVICE_URL}/api/chat/stream/general`,
        MICRO_STRICT_RAG_STREAM: `${CHAT_MICROSERVICE_URL}/api/chat/stream/rag`,
        MAINAPP_GENERAL_RAG: `${API_BASE_URL}/api/user/chat/generalRag`
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

