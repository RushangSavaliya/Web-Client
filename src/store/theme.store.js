// File: src/store/theme.store.js

  import { create } from "zustand";

  // Helper functions
const getStoredTheme = () => {
  const stored = localStorage.getItem("theme");
  if (stored && (stored === "light" || stored === "dark")) {
    return stored;
  }
  // Default to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
};

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
};

  // Zustand store
  const useThemeStore = create((set) => ({
    theme: getStoredTheme(),
    setTheme: (newTheme) => {
      applyTheme(newTheme);
      set({ theme: newTheme });
    },
  }));

  // Apply theme on initial load
  applyTheme(getStoredTheme());

  export default useThemeStore;
