import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

import { voyageLoggerPlugin } from "@99mini/logger-client/plugin";
import { defineConfig } from "vite";

const VOYAGE_BASE_URL = process.env.VITE_VOYAGE_BASE_URL;
const VOYAGE_API_KEY = process.env.VITE_VOYAGE_API_KEY;

const isVoyageConfigValid = VOYAGE_BASE_URL && VOYAGE_API_KEY;

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    isVoyageConfigValid
      ? voyageLoggerPlugin({
          baseUrl: VOYAGE_BASE_URL,
          apiKey: VOYAGE_API_KEY,
          app: process.env.VITE_VOYAGE_APP,
        })
      : null,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
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
