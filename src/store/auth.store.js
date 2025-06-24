// File: src/store/auth.store.js

// =======================
// Imports
// =======================
import { create } from "zustand";
import axiosInstance from "../lib/axios";

// =======================
// Auth Store Definition
// =======================
const authStore = create((set) => ({
    // =======================
    // State
    // =======================
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),
    user: null, // 👈 Add user state

    // =======================
    // Actions
    // =======================

    // ---- Login Action ----
    login: async (token) => {
        if (!token) return false;

        localStorage.setItem("token", token);
        set({ token, isLoggedIn: true });

        try {
            const res = await axiosInstance.get("/auth/me");
            const user = res.data?.user;
            if (user) {
                set({ user });
                return true;
            }
            throw new Error("Invalid session");
        } catch {
            localStorage.removeItem("token");
            set({ token: null, isLoggedIn: false, user: null });
            return false;
        }
    },

    // ---- Logout Action ----
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

// =======================
// Export
// =======================
export default authStore;
