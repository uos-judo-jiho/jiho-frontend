import path from "path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

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
  server: {
    port: 4175,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
