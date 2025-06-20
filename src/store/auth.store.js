// File: src/store/auth.store.js

import { create } from "zustand";
import axiosInstance from "../lib/axios";

const authStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),
    user: null, // 👈 Add user state

    login: async (token) => {
        if (!token) return false;

        localStorage.setItem("token", token);
        set({ token, isLoggedIn: true });

        try {
            const res = await axiosInstance.get("/auth/me");
            if (res.data?.user) {
                set({ user: res.data.user }); // ✅ Save user info
                return true;
            }
            throw new Error("Invalid session");
        } catch {
            localStorage.removeItem("token");
            set({ token: null, isLoggedIn: false, user: null });
            return false;
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem("token");
            set({ token: null, isLoggedIn: false, user: null });
        }
    },
}));

export default authStore;
