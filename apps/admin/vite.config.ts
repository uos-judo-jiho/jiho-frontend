import path from "path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vite";

const workspaceRoot = path.resolve(__dirname, "..");
const sharedSrc = path.resolve(workspaceRoot, "web/src");

export default defineConfig({
  base: "/admin/",
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": sharedSrc,
      "@web": sharedSrc,
    },
  },
  server: {
    port: 4175,
    fs: {
      // Allow importing source files from the shared web package
      allow: [workspaceRoot],
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
