import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_BACKEND_URL_MAIN || "http://localhost:4040", // Zaxira URL qo'shildi
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "dist", // Railway statik fayllarni `dist`dan oladi
      sourcemap: isProduction, // Ishlab chiqarishda sourcemap qo'shiladi
    },
    define: {
      "process.env": {
        VITE_BACKEND_URL_MAIN: JSON.stringify(
          process.env.VITE_BACKEND_URL_MAIN,
        ),
      },
    },
  };
});
