// File: src/lib/httpClient.js

import axios from "axios";
import authStore from "../store/authStore";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
    const { token } = authStore.getState();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
