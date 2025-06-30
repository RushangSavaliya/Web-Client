// File: src/store/theme.store.js

import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "dim",
  setTheme: (newTheme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    set({ theme: newTheme });
  },
}));

// Apply theme on load
document.documentElement.setAttribute(
  "data-theme",
  localStorage.getItem("theme") || "dim"
);

export default useThemeStore;
