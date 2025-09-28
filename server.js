import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import express from "express";
import multer from "multer";
import { default as nodeConsole } from "node:console";
import fs from "node:fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const REACT_EXPRESS_SERVER = "[REACT-EXPRESS-SERVER]";
const CONSOLE_PREFIX = {
  LOG: `[LOG]${REACT_EXPRESS_SERVER}`,
  INFO: `[INFO]${REACT_EXPRESS_SERVER}`,
  ERROR: `[ERROR]${REACT_EXPRESS_SERVER}`,
  WARN: `[WARN]${REACT_EXPRESS_SERVER}`,
};

// --local for development mode
// No flag for production mode
const args = process.argv.slice(2);

nodeConsole.log("Arguments received:", args);

const isLocal = args.includes("--local");

const console = {
  log: (...args) => {
    if (!isLocal) return;
    nodeConsole.log(`${CONSOLE_PREFIX.LOG}`, ...args);
  },
  info: (...args) => {
    if (!isLocal) return;
    nodeConsole.log(`${CONSOLE_PREFIX.INFO}`, ...args);
  },
  error: (...args) => {
    if (!isLocal) return;
    nodeConsole.error(`${CONSOLE_PREFIX.ERROR}`, ...args);
  },
  warn: (...args) => {
    if (!isLocal) return;
    nodeConsole.warn(`${CONSOLE_PREFIX.WARN}`, ...args);
  },
};

console.info();

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const base = process.env.BASE || "/";

console.info(`${CONSOLE_PREFIX.INFO} Environment: ${process.env.NODE_ENV}`);
console.info(`${CONSOLE_PREFIX.INFO} isLocal: ${isLocal}`);
console.info(`${CONSOLE_PREFIX.INFO} Base path set to: ${base}`);

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const S3_BUCKET = process.env.AWS_S3_BUCKET;
const UPLOAD_MAX_SIZE =
  parseInt(process.env.S3_UPLOAD_MAX_SIZE) || 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = (
  process.env.S3_ALLOWED_EXTENSIONS || "jpg,jpeg,png,gif,webp,pdf,doc,docx"
).split(",");

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: UPLOAD_MAX_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `허용되지 않는 파일 확장자입니다. 허용 확장자: ${ALLOWED_EXTENSIONS.join(
            ", "
          )}`
        )
      );
    }
  },
});

// BFF Utilities
function bffLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] BFF ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}

function bffSecurityMiddleware(req, res, next) {
  // _internal API 보안 검증
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const userAgent = req.headers["user-agent"];
  const customHeader = req.headers["x-jiho-internal"];

  // 1. 커스텀 헤더 검증 (가장 강력한 방법)
  const expectedToken = process.env.INTERNAL_API_TOKEN || "jiho-internal-2024";

  if (!customHeader || customHeader !== expectedToken) {
    console.warn(
      `[SECURITY] _internal API 접근 거부 - 잘못된 내부 토큰: ${req.method} ${req.originalUrl} from ${req.ip}`
    );
    console.warn(`Expected: ${expectedToken}, Received: ${customHeader}`);
    return res.status(403).json({
      error: "Forbidden",
      message: "Internal API requires valid authentication",
    });
  }

  // 2. Content-Type 검증 (POST/PUT 요청의 경우)
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = req.headers["content-type"];
    if (
      !contentType ||
      (!contentType.includes("application/json") &&
        !contentType.includes("multipart/form-data"))
    ) {
      console.warn(
        `[SECURITY] _internal API 접근 거부 - 잘못된 Content-Type: ${contentType}`
      );
      return res.status(403).json({
        error: "Forbidden",
        message: "Invalid content type for internal API",
      });
    }
  }

  // 3. User-Agent 검증 (기본적인 필터링)
  if (
    !userAgent ||
    userAgent.includes("curl") ||
    userAgent.includes("wget") ||
    userAgent.includes("Postman")
  ) {
    console.warn(
      `[SECURITY] _internal API 접근 거부 - 의심스러운 User-Agent: ${userAgent}`
    );
    return res.status(403).json({
      error: "Forbidden",
      message: "Invalid user agent for internal API",
    });
  }

  // 4. Origin/Referer 이중 검증 (추가 보안층)
  const allowedHosts = (
    process.env.ALLOWED_HOSTS || `localhost:${port},127.0.0.1:${port}`
  ).split(",");
  const allowedOrigins = allowedHosts
    .map((h) => `http://${h}`)
    .concat(allowedHosts.map((h) => `https://${h}`));

  if (!isProduction) {
    allowedOrigins.push("http://localhost:3000", "http://127.0.0.1:3000");
  }

  let validOrigin = false;
  if (origin && allowedOrigins.includes(origin)) {
    validOrigin = true;
  } else if (!origin && referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      if (allowedOrigins.includes(refererOrigin)) {
        validOrigin = true;
      }
    } catch (e) {
      // Invalid referer URL
    }
  }

  if (!validOrigin) {
    console.warn(
      `[SECURITY] _internal API 접근 거부 - 잘못된 Origin/Referer: ${
        origin || referer
      } from ${req.ip}`
    );
    return res.status(403).json({
      error: "Forbidden",
      message: "Invalid origin for internal API",
    });
  }

  next();
}

function bffErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error("BFF Error occurred:", {
    statusCode,
    message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

async function proxyToBackend(path, req, res) {
  const BACKEND_URL = process.env.BACKEND_URL || "https://uosjudo.com/api";

  try {
    const queryString = new URLSearchParams(req.query).toString();
    const fullUrl = queryString
      ? `${BACKEND_URL}${path}?${queryString}`
      : `${BACKEND_URL}${path}`;

    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": req.headers["user-agent"] || "jiho-bff-proxy",
        ...(req.headers.authorization && {
          Authorization: req.headers.authorization,
        }),
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const data = await response.text();

    // Set response headers
    res.status(response.status);
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json"
    );

    // Copy relevant headers from backend response
    const headersToProxy = ["cache-control", "etag", "last-modified"];
    headersToProxy.forEach((header) => {
      const value = response.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    });

    res.send(data);
  } catch (error) {
    console.error("BFF Proxy error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to proxy request to backend",
    });
  }
}

// Upload progress tracking
const uploadProgressMap = new Map();

// Temporary SSE tokens (uploadId -> {token, createdAt, ipAddress})
const sseTokenMap = new Map();

// SSE 토큰 생성 함수
function generateSSEToken(uploadId, ipAddress) {
  const token = uuidv4();
  const createdAt = Date.now();
  const expiresAt = createdAt + 5 * 60 * 1000; // 5분 후 만료

  sseTokenMap.set(uploadId, {
    token,
    createdAt,
    expiresAt,
    ipAddress,
    used: false,
  });

  // 5분 후 자동 정리
  setTimeout(() => {
    sseTokenMap.delete(uploadId);
  }, 5 * 60 * 1000);

  return token;
}

// SSE 토큰 검증 함수
function validateSSEToken(uploadId, token, ipAddress) {
  const tokenData = sseTokenMap.get(uploadId);

  if (!tokenData) {
    return { valid: false, reason: "Token not found" };
  }

  if (tokenData.used) {
    return { valid: false, reason: "Token already used" };
  }

  if (Date.now() > tokenData.expiresAt) {
    sseTokenMap.delete(uploadId);
    return { valid: false, reason: "Token expired" };
  }

  if (tokenData.token !== token) {
    return { valid: false, reason: "Invalid token" };
  }

  if (tokenData.ipAddress !== ipAddress) {
    return { valid: false, reason: "IP address mismatch" };
  }

  // 토큰을 사용됨으로 표시
  tokenData.used = true;

  return { valid: true };
}

// S3 Upload Functions
async function uploadToS3(file, folder = "uploads", uploadId = null) {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileName = `${folder}/${uuidv4()}${fileExtension}`;

  if (uploadId) {
    uploadProgressMap.set(uploadId, {
      uploadId,
      fileName: file.originalname,
      progress: 0,
      status: "uploading",
    });
  }

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });

  try {
    if (uploadId) {
      uploadProgressMap.set(uploadId, {
        uploadId,
        fileName: file.originalname,
        progress: 50,
        status: "uploading",
      });
    }

    await s3Client.send(command);

    const fileUrl = `https://${S3_BUCKET}.s3.${
      process.env.AWS_REGION || "ap-northeast-2"
    }.amazonaws.com/${fileName}`;

    const result = {
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };

    if (uploadId) {
      uploadProgressMap.set(uploadId, {
        uploadId,
        fileName: file.originalname,
        progress: 100,
        status: "completed",
        url: fileUrl,
      });
    }

    return result;
  } catch (error) {
    console.error("S3 Upload error:", error);

    if (uploadId) {
      uploadProgressMap.set(uploadId, {
        uploadId,
        fileName: file.originalname,
        progress: 0,
        status: "error",
        error: error.message,
      });
    }

    throw new Error("S3 업로드에 실패했습니다.");
  }
}

async function generatePresignedUrl(
  fileName,
  folder = "uploads",
  expiresIn = 3600
) {
  const key = `${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ACL: "public-read",
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      uploadUrl: signedUrl,
      fileUrl: `https://${S3_BUCKET}.s3.${
        process.env.AWS_REGION || "ap-northeast-2"
      }.amazonaws.com/${key}`,
      key: key,
    };
  } catch (error) {
    console.error("Presigned URL generation error:", error);
    throw new Error("Presigned URL 생성에 실패했습니다.");
  }
}

// Create http server
const app = express();

// SSE endpoint for upload progress (보안 미들웨어 이전에 배치)
app.get("/_internal/api/upload/progress", (req, res) => {
  const { uploadId, token } = req.query;

  if (!uploadId || !token) {
    return res.status(400).json({ error: "uploadId and token are required" });
  }

  // 임시 토큰 검증
  const validation = validateSSEToken(uploadId, token, req.ip);
  if (!validation.valid) {
    console.warn(
      `[SECURITY] SSE _internal API 접근 거부 - ${validation.reason}: uploadId=${uploadId}, token=${token} from ${req.ip}`
    );
    return res.status(403).json({
      error: "Invalid or expired token",
      reason: validation.reason,
    });
  }

  console.info(
    `[SSE] 업로드 진행 상황 연결 성공: uploadId=${uploadId} from ${req.ip}`
  );

  // SSE 헤더 설정
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  // 초기 연결 확인
  res.write('data: {"type":"connected","uploadId":"' + uploadId + '"}\n\n');

  // 진행 상황 전송 함수
  const sendProgress = () => {
    const progress = uploadProgressMap.get(uploadId);
    if (progress) {
      res.write(
        `data: ${JSON.stringify({
          type: "progress",
          ...progress,
        })}\n\n`
      );

      // 완료되거나 에러가 발생한 경우 연결 종료
      if (progress.status === "completed" || progress.status === "error") {
        res.write('data: {"type":"close"}\n\n');
        res.end();
        return;
      }
    }
  };

  // 초기 진행 상황 전송
  sendProgress();

  // 주기적으로 진행 상황 확인 (1초마다)
  const progressInterval = setInterval(sendProgress, 1000);

  // 클라이언트 연결 종료 시 정리
  req.on("close", () => {
    clearInterval(progressInterval);
    res.end();
  });

  // 30초 후 자동 종료
  setTimeout(() => {
    clearInterval(progressInterval);
    res.write('data: {"type":"timeout"}\n\n');
    res.end();
  }, 30000);
});

// BFF middleware for internal routes
app.use("/_internal", (req, res, next) => {
  if (req.path.startsWith("/api/upload")) {
    return next();
  }
  bffSecurityMiddleware(req, res, next);
});
app.use("/_internal", bffLogger);
app.use("/_internal", express.json({ limit: "10mb" }));
app.use("/_internal", express.urlencoded({ extended: true, limit: "10mb" }));

// BFF Internal API Routes
app.get("/_internal/health", (req, res) => {
  res.json({
    status: "OK",
    service: "BFF Internal Routes",
    timestamp: new Date().toISOString(),
  });
});

app.get("/_internal/api", (req, res) => {
  res.json({
    message: "Jiho BFF Internal API",
    version: "1.0.0",
    endpoints: {
      news: "/_internal/api/news/:year",
      notices: "/_internal/api/notices",
      trainings: "/_internal/api/trainings?year=<year>",
      admin: "/_internal/api/admin",
      upload: "/_internal/api/upload",
      "upload-url": "/_internal/api/upload-url/:fileName",
    },
  });
});

// S3 File Upload Routes - Async with progress tracking
app.post(
  "/_internal/api/upload",
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "파일이 제공되지 않았습니다.",
        });
      }

      if (!S3_BUCKET) {
        return res.status(500).json({
          error: "S3 설정이 구성되지 않았습니다.",
        });
      }

      const folder = req.body.folder || "uploads";
      const uploadId = uuidv4();

      // SSE 임시 토큰 생성
      const sseToken = generateSSEToken(uploadId, req.ip);

      // 즉시 uploadId와 SSE 토큰 반환하여 클라이언트가 차단되지 않도록 함
      res.json({
        uploadId,
        sseToken,
        message: "업로드가 시작되었습니다.",
      });

      // 백그라운드에서 비동기 업로드 수행
      uploadToS3(req.file, folder, uploadId).catch((error) => {
        console.error("Background upload error:", error);
      });
    } catch (error) {
      console.error("Upload error:", error);
      next(error);
    }
  }
);

// Multiple file upload - Async with progress tracking
app.post(
  "/_internal/api/upload/multiple",
  upload.array("files", 10),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          error: "파일이 제공되지 않았습니다.",
        });
      }

      if (!S3_BUCKET) {
        return res.status(500).json({
          error: "S3 설정이 구성되지 않았습니다.",
        });
      }

      const folder = req.body.folder || "uploads";
      const uploadId = uuidv4();

      // SSE 임시 토큰 생성
      const sseToken = generateSSEToken(uploadId, req.ip);

      // 즉시 uploadId와 SSE 토큰 반환하여 클라이언트가 차단되지 않도록 함
      res.json({
        uploadId,
        sseToken,
        message: "다중 업로드가 시작되었습니다.",
        fileCount: req.files.length,
      });

      // 백그라운드에서 비동기 다중 업로드 수행
      Promise.all(
        req.files.map((file, index) =>
          uploadToS3(file, folder, `${uploadId}-${index}`)
        )
      )
        .then((results) => {
          uploadProgressMap.set(uploadId, {
            uploadId,
            fileName: `${req.files.length}개 파일`,
            progress: 100,
            status: "completed",
            files: results,
          });
        })
        .catch((error) => {
          console.error("Background multiple upload error:", error);
          uploadProgressMap.set(uploadId, {
            uploadId,
            fileName: `${req.files.length}개 파일`,
            progress: 0,
            status: "error",
            error: error.message,
          });
        });
    } catch (error) {
      console.error("Multiple upload error:", error);
      next(error);
    }
  }
);

// Generate presigned URL for direct client upload
app.post("/_internal/api/upload-url/:fileName", async (req, res, next) => {
  try {
    const { fileName } = req.params;
    const { folder = "uploads", expiresIn = 3600 } = req.body;

    if (!S3_BUCKET) {
      return res.status(500).json({
        error: "S3 설정이 구성되지 않았습니다.",
      });
    }

    const result = await generatePresignedUrl(fileName, folder, expiresIn);
    res.json(result);
  } catch (error) {
    console.error("Presigned URL error:", error);
    next(error);
  }
});

// Get upload configuration
app.get("/_internal/api/upload/config", (req, res) => {
  res.json({
    maxSize: UPLOAD_MAX_SIZE,
    allowedExtensions: ALLOWED_EXTENSIONS,
    bucket: S3_BUCKET ? S3_BUCKET.replace(/^(.{3}).*(.{3})$/, "$1***$2") : null,
    configured: !!S3_BUCKET,
  });
});

// Upload cancellation endpoint
app.delete("/_internal/api/upload/:uploadId", (req, res) => {
  const { uploadId } = req.params;

  if (uploadProgressMap.has(uploadId)) {
    uploadProgressMap.delete(uploadId);
    res.json({ success: true, message: "Upload cancelled" });
  } else {
    res.status(404).json({ error: "Upload not found" });
  }
});

// BFF API Routes - News
app.use("/_internal/api/news*", async (req, res, next) => {
  try {
    const path = req.params[0] || "";
    await proxyToBackend(`/news${path}`, req, res);
  } catch (error) {
    next(error);
  }
});

// BFF API Routes - Notices
app.use("/_internal/api/notices*", async (req, res, next) => {
  try {
    const path = req.params[0] || "";
    await proxyToBackend(`/notice${path}`, req, res);
  } catch (error) {
    next(error);
  }
});

// BFF API Routes - Trainings
app.use("/_internal/api/trainings*", async (req, res, next) => {
  try {
    const path = req.params[0] || "";
    await proxyToBackend(`/trading${path}`, req, res);
  } catch (error) {
    next(error);
  }
});

// BFF API Routes - Admin
app.use("/_internal/api/admin*", async (req, res, next) => {
  try {
    const path = req.params[0] || "";
    await proxyToBackend(`/admin${path}`, req, res);
  } catch (error) {
    next(error);
  }
});

// BFF Error handler (must be after routes)
app.use("/_internal", bffErrorHandler);

// API proxy for preview mode
if (isProduction) {
  app.use("/api", async (req, res) => {
    try {
      const targetUrl = `https://uosjudo.com/api${req.path}`;
      const queryString = new URLSearchParams(req.query).toString();
      const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

      const response = await fetch(fullUrl, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": req.headers["user-agent"] || "proxy",
        },
        body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
      });

      const data = await response.text();

      // Set safe headers
      res.status(response.status);
      res.setHeader(
        "Content-Type",
        response.headers.get("content-type") || "application/json"
      );
      res.send(data);
    } catch (error) {
      console.error(`${CONSOLE_PREFIX.ERROR} Proxy error:`, error);
      res.status(500).json({ error: "Proxy error" });
    }
  });
}

// Cached production assets
let templateHtml = "";
if (isProduction) {
  console.info(`${CONSOLE_PREFIX.INFO} Running in production mode`);
  templateHtml = await fs.readFile("./build/client/index.html", "utf-8");
  console.info(`${CONSOLE_PREFIX.INFO} Production assets cached`, templateHtml);
}

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  console.info(`${CONSOLE_PREFIX.INFO} Running in development mode`);
  console.info(`${CONSOLE_PREFIX.INFO} Starting Vite server...`);
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  // Vite 미들웨어를 BFF 라우트 다음에 배치
  app.use((req, res, next) => {
    if (req.path.startsWith("/_internal")) {
      return next("route"); // BFF 라우트 우선
    }
    return vite.middlewares(req, res, next);
  });
} else {
  console.info(
    `${CONSOLE_PREFIX.INFO} Serving static assets from ./build/client`
  );
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./build/client", { extensions: [] }));
}

// admin 페이지는 client 사이드 렌더링으로 처리
app.use("/admin*", (res) => {
  res.sendFile("index.html", { root: "./build/client" });
});

// Serve HTML
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    /** @type {string} */
    let template;

    /** @type {import('./src/entry-server.tsx').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;

      console.info(
        `[DEV]${CONSOLE_PREFIX.INFO} ${req.method} ${req.originalUrl}`
      );
    } else {
      template = templateHtml;
      render = (await import("./build/server/entry-server.js")).render;

      console.info(`${CONSOLE_PREFIX.INFO} ${req.method} ${req.originalUrl}`);
    }

    const rendered = render(url);

    const html = template.replace(`<!--app-html-->`, rendered);

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
