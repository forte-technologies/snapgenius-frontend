// src/hooks/useProtectedApi.js
import { useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import apiClient from "../config/api";

export const useProtectedApi = () => {
    const { accessToken, logout, refreshUser } = useAuth();

    const callApi = useCallback(
        async (endpoint, options = {}) => {
            let token = accessToken || localStorage.getItem("access_token");
            if (!token) {
                logout();
                throw new Error("Authentication required");
            }

            try {
                const response = await apiClient({
                    url: endpoint,
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                return response;
            } catch (err) {
                console.error("API call failed:", err);
                if (
                    err.response &&
                    err.response.status === 401 &&
                    err.message.includes("Authentication")
                ) {
                    try {
                        await refreshUser();
                        return callApi(endpoint, options);
                    } catch (refreshError) {
                        logout();
                        throw new Error("Session expired. Please login again.");
                    }
                }
                throw err;
            }
        },
        [accessToken, logout, refreshUser]
    );

    return { callApi };
};
