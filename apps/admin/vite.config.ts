import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";

const srcDir = path.resolve(__dirname, "src");

export default defineConfig({
  base: "/",
  plugins: [tailwindcss(), react()],

  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  preview: {
    port: 3001,
    proxy: {
      "/api": {
        target: "https://api.uosjudo.com",
        changeOrigin: true,
        rewrite: (path) => path,
        secure: false,
        ws: true,
      },
    },
  },
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => path,
        secure: false,
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
