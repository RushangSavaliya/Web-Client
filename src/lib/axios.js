// =======================
// Imports
// =======================
import axios from "axios";
import authStore from "../store/auth.store";

// =======================
// Axios Instance Creation
// =======================
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});

// =======================
// Request Interceptor
// =======================
axiosInstance.interceptors.request.use((config) => {
  const { token } = authStore.getState(); // ✅ Zustand access
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =======================
// Export
// =======================
export default axiosInstance;
