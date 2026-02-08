import dotenv from "dotenv";
import { default as nodeConsole } from "node:console";
import type { ConsolePrefix } from "./types.js";

// Load environment variables from .env file
dotenv.config();

const COLOR = {
  RESET: "\x1b[0m",
  LOG: "\x1b[37m",
  INFO: "\x1b[34m",
  ERROR: "\x1b[31m",
  WARN: "\x1b[33m",
};

export const CONSOLE_PREFIX: ConsolePrefix = {
  LOG: "[LOG]",
  INFO: "[INFO]",
  ERROR: "[ERROR]",
  WARN: "[WARN]",
};

// --local for development mode
// No flag for production mode
const args = process.argv.slice(2);

nodeConsole.log("Arguments received:", args);

export const isLocal = args.includes("--local");

export const customConsole = {
  log: (...args: any[]) => {
    nodeConsole.log(`${COLOR.LOG}${CONSOLE_PREFIX.LOG}`, ...args, COLOR.RESET);
  },
  info: (...args: any[]) => {
    nodeConsole.log(
      `${COLOR.INFO}${CONSOLE_PREFIX.INFO}`,
      ...args,
      COLOR.RESET,
    );
  },
  error: (...args: any[]) => {
    nodeConsole.error(
      `${COLOR.ERROR}${CONSOLE_PREFIX.ERROR}`,
      ...args,
      COLOR.RESET,
    );
  },
  warn: (...args: any[]) => {
    nodeConsole.warn(
      `${COLOR.WARN}${CONSOLE_PREFIX.WARN}`,
      ...args,
      COLOR.RESET,
    );
  },
};

customConsole.info();

// Constants
export const isProduction = process.env.NODE_ENV === "production";
export const port = process.env.PORT || 3000;
export const base = process.env.BASE || "/";

customConsole.info(`Environment: ${process.env.NODE_ENV}`);
customConsole.info(`isLocal: ${isLocal}`);
customConsole.info(`Base path set to: ${base}`);

export const BACKEND_URL =
  process.env.BACKEND_URL || "https://api.uosjudo.com/api";
export const INTERNAL_API_TOKEN =
  process.env.INTERNAL_API_TOKEN || "jiho-internal-2024";
export const ALLOWED_HOSTS = (
  process.env.ALLOWED_HOSTS || `localhost:${port},127.0.0.1:${port}`
).split(",");
export const CANONICAL_DOMAIN =
  process.env.CANONICAL_DOMAIN || "https://uosjudo.com";
