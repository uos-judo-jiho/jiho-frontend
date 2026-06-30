import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const srcDir = path.resolve(__dirname, "src");

export default defineConfig({
  base: "/",
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png", "icons/*.svg"],
      manifest: {
        name: "지호 쇼츠 라벨링",
        short_name: "지호쇼츠",
        description: "UOS 유도부 하이라이트 쇼츠 라벨링",
        theme_color: "#0f0c0c",
        background_color: "#0f0c0c",
        display: "standalone",
        orientation: "landscape",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.uosjudo\.com\/api\/v2\/admin\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  preview: {
    port: 3002,
    proxy: {
      "/api": {
        target: "https://api.uosjudo.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  server: {
    port: 3002,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "https://api.uosjudo.com",
        changeOrigin: true,
        secure: false,
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
  },
});
