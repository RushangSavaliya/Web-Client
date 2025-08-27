// File: src/store/userStore.js

import { create } from "zustand";

const useUserStore = create((set) => ({
    allUsers: [],
    setAllUsers: (users) => set({ allUsers: users }),

    onlineUsers: [],
    setOnlineUsers: (users) => set({ onlineUsers: users }),
}));

export default useUserStore;
