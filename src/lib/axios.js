// File: src/lib/axios.js

import axios from "axios";
import authStore from "../store/auth.store";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const { token } = authStore.getState(); // ✅ Zustand access
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
