import fs from "node:fs/promises";
import express from "express";
import { default as nodeConsole } from "node:console";

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

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const base = process.env.BASE || "/";

console.info(`${CONSOLE_PREFIX.INFO} Environment: ${process.env.NODE_ENV}`);
console.info(`${CONSOLE_PREFIX.INFO} isLocal: ${isLocal}`);
console.info(`${CONSOLE_PREFIX.INFO} Base path set to: ${base}`);

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

function bffErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error("BFF Error occurred:", {
    statusCode,
    message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}

async function proxyToBackend(path, req, res) {
  const BACKEND_URL = process.env.BACKEND_URL || 'https://uosjudo.com/api';

  try {
    const queryString = new URLSearchParams(req.query).toString();
    const fullUrl = queryString ? `${BACKEND_URL}${path}?${queryString}` : `${BACKEND_URL}${path}`;

    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'jiho-bff-proxy',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();

    // Set response headers
    res.status(response.status);
    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'application/json'
    );

    // Copy relevant headers from backend response
    const headersToProxy = ['cache-control', 'etag', 'last-modified'];
    headersToProxy.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    });

    res.send(data);
  } catch (error) {
    console.error('BFF Proxy error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to proxy request to backend'
    });
  }
}

// Create http server
const app = express();

// BFF middleware for internal routes
app.use("/_internal", bffLogger);
app.use("/_internal", express.json({ limit: "10mb" }));
app.use("/_internal", express.urlencoded({ extended: true, limit: "10mb" }));

// BFF Internal API Routes
app.get("/_internal/health", (req, res) => {
  res.json({
    status: "OK",
    service: "BFF Internal Routes",
    timestamp: new Date().toISOString()
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
      admin: "/_internal/api/admin"
    }
  });
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
    if (req.path.startsWith('/_internal')) {
      return next('route'); // BFF 라우트 우선
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
