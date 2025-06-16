// File: src/store/auth.store.js

import { create } from "zustand";
import axiosInstance from "../lib/axios";

const authStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),

    login: async (token) => {
        if (!token) return false;

        // 1. Optimistically persist token (so interceptor picks it up)
        localStorage.setItem("token", token);
        set({ token, isLoggedIn: true });

        // 2. Verify session by calling /auth/me
        try {
            const res = await axiosInstance.get("/auth/me");
            if (res.data?.user) {
                return true;
            }
            throw new Error("Invalid session");
        } catch {
            // 3. Roll back on failure
            localStorage.removeItem("token");
            set({ token: null, isLoggedIn: false });
            return false;
        }
    },

    logout: async () => {
        try {
            // Hit backend to destroy session
            await axiosInstance.post("/auth/logout");
        } catch(error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem("token");
            set({ token: null, isLoggedIn: false });
        }
    },
}));

export default authStore;
