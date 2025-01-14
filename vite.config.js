import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": { target: "http://localhost:5001/", prependPath: true, changeOrigin: true, secure: false, ws: true },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
