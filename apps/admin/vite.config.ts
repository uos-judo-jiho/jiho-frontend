import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

const srcDir = path.resolve(__dirname, "src");

export default defineConfig({
  base: "/",
  plugins: [tailwindcss(), react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/test/setup.ts",
    exclude: [...configDefaults.exclude, "e2e/*"],
  },
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
        // prod api(https)를 프록시할 때, 인증 쿠키가 http://localhost 에 저장되도록
        // Set-Cookie 의 Secure/Domain 을 제거하고 SameSite 를 Lax 로 맞춘다.
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const setCookie = proxyRes.headers["set-cookie"];
            if (setCookie) {
              proxyRes.headers["set-cookie"] = setCookie.map((cookie) =>
                cookie
                  .replace(/;\s*Secure/gi, "")
                  .replace(/;\s*Domain=[^;]+/gi, "")
                  .replace(/;\s*SameSite=None/gi, "; SameSite=Lax"),
              );
            }
          });
        },
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
