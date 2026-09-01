import path from "path";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

const srcDir = path.resolve(__dirname, "src");

export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [
    // routes/ 트리를 읽어 routeTree.gen.ts 를 생성한다.
    // react() 보다 먼저 와야 생성된 트리가 그대로 변환 대상이 된다.
    tanstackRouter({
      target: "react",
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
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
        target: process.env.VITE_API_PROXY_TARGET || "https://api.uosjudo.com",
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
    rollupOptions: {
      // 여기 있던 build.terserOptions 는 한 번도 동작한 적이 없었다. terserOptions
      // 는 minify: 'terser' 일 때만 읽히는데 그걸 켜지 않았으므로, drop_console 이
      // 적용된 적이 없다.
      //
      // 그렇다고 apps/web 처럼 esbuild.pure 를 쓸 수도 없다. web 은 minify 를
      // 'esbuild' 로 못박아 두어 그 옵션이 살아 있지만, 여기는 minify 를 지정하지
      // 않아 vite 8 의 기본값인 oxc 미니파이어가 돌고 oxc 는 esbuild 옵션을 읽지
      // 않는다. rolldown 쪽 대응 옵션이 이것이다.
      //
      // console.error/warn 은 일부러 남긴다 — 관리자 화면에서 문제가 났을 때
      // 콘솔이 비어 있으면 원인을 물어볼 수조차 없다.
      // (debugger 는 oxc 가 기본으로 제거하므로 따로 설정하지 않는다)
      treeshake: {
        manualPureFunctions:
          mode === "production"
            ? ["console.log", "console.debug", "console.trace"]
            : [],
      },
    },
  },
}));
