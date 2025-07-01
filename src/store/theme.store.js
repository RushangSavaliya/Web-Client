  // File: src/store/theme.store.js

  import { create } from "zustand";

  // Helper functions
  const getStoredTheme = () => localStorage.getItem("theme") || "nord";

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
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
