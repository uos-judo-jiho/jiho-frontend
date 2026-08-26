import path from "path";

import tailwindcss from "@tailwindcss/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";

import { voyageLoggerPlugin } from "@99mini/logger-client/plugin";
import { defineConfig, loadEnv } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const VOYAGE_BASE_URL = env.VITE_VOYAGE_BASE_URL;
  const VOYAGE_API_KEY = env.VITE_VOYAGE_API_KEY;

  const isVoyageConfigValid = VOYAGE_BASE_URL && VOYAGE_API_KEY;

  return {
    plugins: [
      tailwindcss(),
      // TanStack Start: 파일 기반 라우팅 + SSR + server routes
      tanstackStart(),
      // 공식 Nitro 어댑터: 정적 자산 서빙까지 포함한 자체 완결 프로덕션 서버를
      // .output/ 에 생성한다 (node .output/server/index.mjs 로 구동)
      nitroV2Plugin({
        preset: "node-server",
        routeRules: {
          // 해시 파일명 자산은 내용이 바뀌면 URL 도 바뀌므로 영구 캐시 가능.
          // (배포로 해시가 바뀌어도 옛 HTML 이 캐시되지 않는 한 안전 — HTML 은
          // __root.tsx 의 headers 에서 no-cache 로 내려간다)
          "/assets/**": {
            headers: {
              "cache-control": "public, max-age=31536000, immutable",
            },
          },
        },
      }),
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
      // /api 프록시는 vite proxy 대신 server route(src/routes/api.$.ts)가
      // dev/prod 동일하게 처리한다.
    },
    build: {
      minify: "esbuild",
      target: "esnext",
    },
    esbuild: {
      drop: mode === "production" ? ["debugger"] : [],
      // console.error/warn 은 서버 번들(프록시/SSR 오류 추적)을 위해 남긴다.
      pure:
        mode === "production"
          ? ["console.log", "console.debug", "console.trace"]
          : [],
    },
    ssr: {
      noExternal: ["@emotion/stylis", "@emotion/unitless"],
    },
  };
});
