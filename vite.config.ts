import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: "http://localhost:4040",
        // target: "https://easyquizbot-production.up.railway.app",
        target: process.env.VITE_BACKEND_URL_MAIN,
        changeOrigin: true,
        secure: false,
        // Optional: Rewrite the URL if backend API expects /api prefix
        // pathRewrite: { '^/api': '/api' },
      },
    },
  },
});
