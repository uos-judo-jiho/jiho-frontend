import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

import { voyageLoggerPlugin } from "@99mini/logger-client/plugin";
import { defineConfig, loadEnv } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const VOYAGE_BASE_URL = env.VITE_VOYAGE_BASE_URL;
  const VOYAGE_API_KEY = env.VITE_VOYAGE_API_KEY;

  const isVoyageConfigValid = VOYAGE_BASE_URL && VOYAGE_API_KEY;

  // 요청 경로가 이미 /api 로 시작하므로, target 이 /api 로 끝나면 중복을 제거한다.
  const apiProxyTarget = (
    env.VITE_API_PROXY_TARGET || "http://localhost:4000"
  ).replace(/\/api\/?$/, "");

  return {
    plugins: [
      tailwindcss(),
      react(),
      isVoyageConfigValid
        ? voyageLoggerPlugin({
            baseUrl: VOYAGE_BASE_URL,
            apiKey: VOYAGE_API_KEY,
            app: env.VITE_VOYAGE_APP,
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
          target: apiProxyTarget,
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
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
    ssr: {
      noExternal: ["@emotion/stylis", "@emotion/unitless"],
    },
  };
});
