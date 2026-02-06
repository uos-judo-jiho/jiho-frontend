import path from "path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://uosjudo.com/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
        ws: true,
      },
    },
    // allowedHosts: ["88601a79b159.ngrok-free.app"],
  },
  build: {
    minify: "esbuild",
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  ssr: {
    noExternal: ["@emotion/stylis", "@emotion/unitless"],
  },
});
