import axios, { AxiosInstance } from "axios";
import { getAccessToken } from "./auth.ts";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Global headers
api.defaults.headers.common["ngrok-skip-browser-warning"] = "69420";

api.interceptors.request.use(
  (config) => {
    const token: string | null = getAccessToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
