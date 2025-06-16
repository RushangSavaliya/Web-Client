// File: src/store/auth.store.js

import { create } from "zustand";
import axiosInstance from "../lib/axios";

const authStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),

    login: async (token) => {
        if (!token) return;

        try {
            localStorage.setItem("token", token);

            const res = await axiosInstance.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data?.user) {
                set({ token, isLoggedIn: true });
            } else {
                throw new Error("Invalid session");
            }
        } catch {
            localStorage.removeItem("token");
            set({ token: null, isLoggedIn: false });
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ token: null, isLoggedIn: false });
    },
}));

export default authStore;
