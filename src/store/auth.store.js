import { create } from "zustand";
import axiosInstance from "../lib/axios";
import socket from "../lib/socket";

const authStore = create((set, get) => ({
    // State
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),
    user: null,

    // Actions
    login: async (token) => {
        if (!token) return false;

        localStorage.setItem("token", token);
        set({ token, isLoggedIn: true });

        try {
            const res = await axiosInstance.get("/auth/me");
            const user = res.data?.user;
            if (user) {
                set({ user });
                
                // Connect socket with the new token
                socket.connect(token);
                
                console.log("User logged in successfully:", user.username);
                return true;
            }
            throw new Error("Invalid session");
        } catch (error) {
            console.error("Login failed:", error);
            localStorage.removeItem("token");
            set({ token: null, isLoggedIn: false, user: null });
            socket.disconnect();
            return false;
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (error) {
            console.error("Logout API failed:", error);
        } finally {
            localStorage.removeItem("token");
            set({ token: null, isLoggedIn: false, user: null });
            
            // Disconnect socket
            socket.disconnect();
            
            console.log("User logged out successfully");
        }
    },

    // Initialize socket connection on app start if token exists
    initializeSocket: () => {
        const { token } = get();
        if (token) {
            socket.connect(token);
        }
    },
}));

export default authStore;
