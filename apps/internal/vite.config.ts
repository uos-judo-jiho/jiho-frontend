import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const srcDir = path.resolve(__dirname, "src");

// The internal app is a local-only tool. The browser talks to the local Node
// sidecar (which runs the Python worker and forwards uploads to the real API),
// so we proxy /sidecar to the sidecar process during development.
const SIDECAR_TARGET = process.env.VITE_SIDECAR_TARGET || "http://localhost:5174";

export default defineConfig({
  base: "/",
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  server: {
    port: 3002,
    proxy: {
      "/sidecar": {
        target: SIDECAR_TARGET,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/sidecar/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
