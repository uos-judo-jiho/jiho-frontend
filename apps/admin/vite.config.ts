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
  server: {
    port: 3001,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
