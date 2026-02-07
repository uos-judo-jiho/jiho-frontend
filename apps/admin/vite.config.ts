import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";

const srcDir = path.resolve(__dirname, "src");

export default defineConfig({
  base: "/admin/",
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
