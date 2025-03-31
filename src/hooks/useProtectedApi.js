// src/hooks/useProtectedApi.js
import { useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import apiClient from "../config/api"; // Import the configured axios instance

export const useProtectedApi = () => {
    const { accessToken, logout, refreshAccessToken } = useAuth();

    const callApi = useCallback(
        async (endpoint, options = {}) => {
            let token = accessToken;

            // If no token is in state, try to get it from localStorage or refresh
            if (!token) {
                token = localStorage.getItem("access_token");
                if (!token) {
                    try {
                        await refreshAccessToken();
                        token = localStorage.getItem("access_token");
                        if (!token) {
                            logout();
                            throw new Error("Authentication required");
                        }
                    } catch (error) {
                        logout();
                        throw new Error("Authentication required");
                    }
                }
            }

            try {
                // Use the apiClient instance from api.js
                const response = await apiClient({
                    url: endpoint,
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                return response; // The interceptor in api.js ensures it's already parsed
            } catch (err) {
                console.error("API call failed:", err);
                if (
                    err.response &&
                    err.response.status === 401 &&
                    err.message.includes("Authentication")
                ) {
                    try {
                        await refreshAccessToken();
                        return callApi(endpoint, options);
                    } catch (refreshError) {
                        logout();
                        throw new Error("Session expired. Please login again.");
                    }
                }
                throw err;
            }
        },
        [accessToken, logout, refreshAccessToken]
    );

    return { callApi };
};