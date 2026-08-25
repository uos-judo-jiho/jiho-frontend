import { default as nodeConsole } from "node:console";

// esbuild 의 `drop: ["console"]` 은 전역 console 호출만 제거하므로,
// 서버 로그는 node:console 을 직접 참조해 프로덕션에서도 남긴다.
const COLOR = {
  RESET: "\x1b[0m",
  LOG: "\x1b[37m",
  INFO: "\x1b[34m",
  ERROR: "\x1b[31m",
  WARN: "\x1b[33m",
};

export const serverConsole = {
  log: (...args: unknown[]) => {
    nodeConsole.log(`${COLOR.LOG}[LOG]`, ...args, COLOR.RESET);
  },
  info: (...args: unknown[]) => {
    nodeConsole.log(`${COLOR.INFO}[INFO]`, ...args, COLOR.RESET);
  },
  error: (...args: unknown[]) => {
    nodeConsole.error(`${COLOR.ERROR}[ERROR]`, ...args, COLOR.RESET);
  },
  warn: (...args: unknown[]) => {
    nodeConsole.warn(`${COLOR.WARN}[WARN]`, ...args, COLOR.RESET);
  },
};

export const isProduction = process.env.NODE_ENV === "production";

export const port = process.env.PORT || 3000;

/**
 * 백엔드 API 오리진 (경로 미포함).
 * BACKEND_URL 이 `/api` 로 끝나더라도 오리진만 남긴다.
 */
export const getBackendBaseUrl = () => {
  const raw =
    process.env.BACKEND_URL ||
    (isProduction ? "https://api.uosjudo.com/api" : "http://localhost:4000");
  return raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

export const INTERNAL_API_TOKEN =
  process.env.INTERNAL_API_TOKEN || "jiho-internal-2024";

export const ALLOWED_HOSTS = (
  process.env.ALLOWED_HOSTS || `localhost:${port},127.0.0.1:${port}`
).split(",");

export const CANONICAL_DOMAIN =
  process.env.CANONICAL_DOMAIN || "https://uosjudo.com";
