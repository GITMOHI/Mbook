import {jwtDecode} from "jwt-decode";
const API_URL = import.meta.env.VITE_API_URL;

export const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include", // Send HTTP-only cookie (refresh token)
        });

        if (!response.ok) throw new Error("Failed to refresh access token");

        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken); // Store new token
        return data.accessToken;
    } catch (error) {
        console.error("Refresh token failed", error);
        return null;
    }
};

// Check if the access token is valid
export const isAccessTokenValid = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp > Date.now() / 1000; // Check if token is expired
    } catch (error) {
        return false;
    }
};
