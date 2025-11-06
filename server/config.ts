import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { default as nodeConsole } from "node:console";
import type { ConsolePrefix } from "./types.js";

// Load environment variables from .env file
dotenv.config();

const REACT_EXPRESS_SERVER = "[REACT-EXPRESS-SERVER]";

export const CONSOLE_PREFIX: ConsolePrefix = {
  LOG: `[LOG]${REACT_EXPRESS_SERVER}`,
  INFO: `[INFO]${REACT_EXPRESS_SERVER}`,
  ERROR: `[ERROR]${REACT_EXPRESS_SERVER}`,
  WARN: `[WARN]${REACT_EXPRESS_SERVER}`,
};

// --local for development mode
// No flag for production mode
const args = process.argv.slice(2);

nodeConsole.log("Arguments received:", args);

export const isLocal = args.includes("--local");

export const customConsole = {
  log: (...args: any[]) => {
    if (!isLocal) return;
    nodeConsole.log(`${CONSOLE_PREFIX.LOG}`, ...args);
  },
  info: (...args: any[]) => {
    if (!isLocal) return;
    nodeConsole.log(`${CONSOLE_PREFIX.INFO}`, ...args);
  },
  error: (...args: any[]) => {
    if (!isLocal) return;
    nodeConsole.error(`${CONSOLE_PREFIX.ERROR}`, ...args);
  },
  warn: (...args: any[]) => {
    if (!isLocal) return;
    nodeConsole.warn(`${CONSOLE_PREFIX.WARN}`, ...args);
  },
};

customConsole.info();

// Constants
export const isProduction = process.env.NODE_ENV === "production";
export const port = process.env.PORT || 3000;
export const base = process.env.BASE || "/";

customConsole.info(`${CONSOLE_PREFIX.INFO} Environment: ${process.env.NODE_ENV}`);
customConsole.info(`${CONSOLE_PREFIX.INFO} isLocal: ${isLocal}`);
customConsole.info(`${CONSOLE_PREFIX.INFO} Base path set to: ${base}`);

// S3 Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const S3_BUCKET = process.env.AWS_S3_BUCKET;
export const UPLOAD_MAX_SIZE =
  parseInt(process.env.S3_UPLOAD_MAX_SIZE || "") || 10 * 1024 * 1024; // 10MB
export const ALLOWED_EXTENSIONS = (
  process.env.S3_ALLOWED_EXTENSIONS || "jpg,jpeg,png,gif,webp,pdf,doc,docx"
).split(",");
export const BACKEND_URL = process.env.BACKEND_URL || "https://uosjudo.com/api";
export const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN || "jiho-internal-2024";
export const ALLOWED_HOSTS = (
  process.env.ALLOWED_HOSTS || `localhost:${port},127.0.0.1:${port}`
).split(",");
