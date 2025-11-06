import express from "express";
import fs from "node:fs/promises";
import path from "path";
import type { ViteDevServer } from "vite";
import {
  base,
  CONSOLE_PREFIX,
  customConsole,
  isProduction,
  port,
} from "./config.js";
import { bffErrorHandler } from "./middleware/error-handler.js";
import { bffLogger } from "./middleware/logger.js";
import { bffSecurityMiddleware } from "./middleware/security.js";
import bffRouter from "./routes/bff.js";
import { handleSSEProgress } from "./routes/sse-progress.js";
import uploadRouter from "./routes/upload.js";

// Create http server
const app = express();

// SSE endpoint for upload progress (보안 미들웨어 이전에 배치)
app.get("/_internal/api/upload/progress", handleSSEProgress);

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

// BFF Routes
app.use("/_internal", bffRouter);
app.use("/_internal/api", uploadRouter);

// BFF Error handler (must be after routes)
app.use("/_internal", bffErrorHandler);

// API proxy for preview mode
if (isProduction) {
  app.use("/api", async (req, res) => {
    try {
      const targetUrl = `https://uosjudo.com/api${req.path}`;
      const queryString = new URLSearchParams(
        req.query as Record<string, string>
      ).toString();
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
  customConsole.info(`${CONSOLE_PREFIX.INFO} Running in production mode`);
  templateHtml = await fs.readFile("./build/client/index.html", "utf-8");
  customConsole.info(
    `${CONSOLE_PREFIX.INFO} Production assets cached`,
    templateHtml
  );
}

// Add Vite or respective production middlewares
let vite: ViteDevServer | undefined;
if (!isProduction) {
  customConsole.info(`${CONSOLE_PREFIX.INFO} Running in development mode`);
  customConsole.info(`${CONSOLE_PREFIX.INFO} Starting Vite server...`);
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
    return vite!.middlewares(req, res, next);
  });
} else {
  customConsole.info(
    `${CONSOLE_PREFIX.INFO} Serving static assets from ./build/client`
  );
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./build/client", { extensions: [] }));
}

// admin 페이지는 client 사이드 렌더링으로 처리
app.use("/admin*", async (req, res) => {
  const url = req.originalUrl.replace(base, "");
  customConsole.info(`${CONSOLE_PREFIX.INFO} ${req.method} ${req.originalUrl}`);
  if (!isProduction) {
    try {
      const html = await fs.readFile("index.html", "utf-8");
      res.send(await vite!.transformIndexHtml(url, html));
      return;
    } catch (error) {
      console.error(`${CONSOLE_PREFIX.ERROR} Error reading index.html:`, error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }
  res.sendFile(path.resolve("./build/client/index.html"));
});

// Serve HTML
app.use("*", async (req, res) => {
  try {
    // Preserve leading slash for routing
    let url = req.originalUrl.replace(base, "");
    if (!url.startsWith("/")) {
      url = "/" + url;
    }

    let template: string;
    let render: (
      url: string
    ) => Promise<{ html: string; dehydratedState: any }>;

    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite!.transformIndexHtml(url, template);
      render = (await vite!.ssrLoadModule("/src/entry-server.tsx")).render;

      customConsole.info(
        `[DEV]${CONSOLE_PREFIX.INFO} ${req.method} ${req.originalUrl}`
      );
    } else {
      template = templateHtml;
      // @ts-ignore - Dynamic import of build artifact
      const buildPath = isProduction
        ? "../server/entry-server.js"
        : "../build/server/entry-server.js";
      // @ts-ignore - Dynamic import of build artifact
      const entryModule = await import(buildPath);
      render = entryModule.render;

      customConsole.info(
        `${CONSOLE_PREFIX.INFO} ${req.method} ${req.originalUrl}`
      );
    }

    const { html: rendered, dehydratedState } = await render(url);

    // Inject dehydrated state into HTML
    const stateScript = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(
      dehydratedState
    ).replace(/</g, "\\u003c")};</script>`;
    const html = template
      .replace(`<!--app-html-->`, rendered)
      .replace(`</head>`, `${stateScript}</head>`);

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e: any) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
