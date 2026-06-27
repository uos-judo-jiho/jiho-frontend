import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type ProxyOptions } from "vite";

const srcDir = path.resolve(__dirname, "src");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const sidecarTarget = env.VITE_SIDECAR_TARGET || "http://localhost:5174";
  const apiTarget = (
    env.VITE_API_PROXY_TARGET ||
    env.API_BASE_URL ||
    "https://api.uosjudo.com"
  )
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  const apiProxy: ProxyOptions = {
    target: apiTarget,
    changeOrigin: true,
    secure: false,
    ws: true,
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
  };

  return {
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
        "/api": apiProxy,
        "/sidecar": {
          target: sidecarTarget,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/sidecar/, ""),
        },
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
