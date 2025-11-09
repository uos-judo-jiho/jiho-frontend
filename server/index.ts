import express from "express";
import fs from "node:fs/promises";
import path from "path";
import type { ViteDevServer } from "vite";
import { base, customConsole, isProduction, port } from "./config.js";
import { bffErrorHandler } from "./middleware/error-handler.js";
import { bffLogger } from "./middleware/logger.js";
import { bffSecurityMiddleware } from "./middleware/security.js";
import bffRouter from "./routes/bff.js";
import { handleSSEProgress } from "./routes/sse-progress.js";
import uploadRouter from "./routes/upload.js";

const PRERENDERED_DIR = path.resolve("./build/prerendered");

const readPrerenderedHtml = async (routePath: string) => {
  const normalizedPath =
    routePath === "/"
      ? "index"
      : routePath.replace(/\/$/, "").replace(/^\//, "");

  if (!normalizedPath) {
    return null;
  }

  const filePath = path.join(PRERENDERED_DIR, `${normalizedPath}.html`);
  try {
    await fs.access(filePath);
    const html = await fs.readFile(filePath, "utf-8");
    return { html, filePath };
  } catch {
    return null;
  }
};

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

// API proxy for both development and production
// Body parsing middleware only for admin routes (other routes are GET-only)
app.use("/api/admin", express.json({ limit: "10mb" }));
app.use("/api/admin", express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", async (req, res) => {
  try {
    // 백엔드 URL 결정 로직
    let backendBaseUrl: string;
    const host = req.get("host") || "";

    // 로컬 개발 환경 (localhost, 127.0.0.1)
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      backendBaseUrl = "https://uosjudo.com";
    } else {
      // 프로덕션: 현재 호스트 기준 (www 제거)
      const hostname = host.replace(/^www\./, "");
      const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
      backendBaseUrl = `${protocol}://${hostname}`;
    }

    const targetUrl = `${backendBaseUrl}/api${req.path}`;
    const queryString = new URLSearchParams(
      req.query as Record<string, string>
    ).toString();
    const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    console.log(`[${req.method}] ${fullUrl}`);

    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": req.headers["user-agent"] || "proxy",
        ...(req.headers.authorization && {
          Authorization: req.headers.authorization,
        }),
        ...(req.headers.cookie && {
          Cookie: req.headers.cookie,
        }),
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    console.log(JSON.stringify(response));

    const data = await response.text();

    // Convert 302 redirects to 401 for CORS compatibility
    // Redirects in preflight requests cause CORS errors
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get("location");
      // If redirecting to login/admin page, it means unauthorized
      if (location?.includes("/admin") || location?.includes("/login")) {
        res.status(401);
        res.setHeader("Content-Type", "application/json");
        res.json({
          error: "Unauthorized",
          message: "Authentication required",
          redirectTo: location,
        });
        return;
      }
    }

    // Forward status and headers from backend
    res.status(response.status);

    // Forward important headers
    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    // Forward Set-Cookie headers (critical for authentication)
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    res.send(data);
  } catch (error) {
    console.error(`Proxy error:`, error);
    res.status(500).json({ error: "Proxy error" });
  }
});

// Cached production assets
let templateHtml = "";
if (isProduction) {
  customConsole.info(`Running in production mode`);
  templateHtml = await fs.readFile("./build/client/index.html", "utf-8");
  customConsole.info(`Production assets cached`, templateHtml);
}

// Add Vite or respective production middlewares
let vite: ViteDevServer | undefined;
if (!isProduction) {
  customConsole.info(`Running in development mode`);
  customConsole.info(`Starting Vite server...`);
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
  customConsole.info(`Serving static assets from ./build/client`);
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./build/client", { extensions: [] }));
}

// admin 페이지는 client 사이드 렌더링으로 처리
app.use("/admin*", async (req, res) => {
  const url = req.originalUrl.replace(base, "");
  customConsole.info(`${req.method} ${req.originalUrl}`);
  if (!isProduction) {
    try {
      const html = await fs.readFile("index.html", "utf-8");
      res.send(await vite!.transformIndexHtml(url, html));
      return;
    } catch (error) {
      console.error(`Error reading index.html:`, error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }
  res.sendFile(path.resolve("./build/client/index.html"));
});

// Serve HTML
app.use("*", async (req, res) => {
  customConsole.log(req.originalUrl);
  try {
    // Preserve leading slash for routing
    let url = req.originalUrl.replace(base, "");
    if (!url.startsWith("/")) {
      url = "/" + url;
    }
    const routePath = url.split("?")[0] || "/";

    if (isProduction) {
      const prerendered = await readPrerenderedHtml(routePath);
      if (prerendered) {
        console.info(`[SSG] ${routePath}`);
        res
          .status(200)
          .set({ "Content-Type": "text/html" })
          .send(prerendered.html);
        return;
      }
    }

    let template: string;
    let render: (url: string) => Promise<{
      html: string;
      dehydratedState: any;
      styleTags: string;
      helmetData: any;
      structuredData: any;
    }>;

    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite!.transformIndexHtml(url, template);
      render = (await vite!.ssrLoadModule("/src/entry-server.tsx")).render;

      customConsole.info(`[DEV] ${req.method} ${req.originalUrl}`);
    } else {
      template = templateHtml;

      const buildPath = "../server/entry-server.js";
      const entryModule = await import(buildPath);
      render = entryModule.render;

      customConsole.info(`${req.method} ${req.originalUrl}`);
    }

    const {
      html: rendered,
      dehydratedState,
      styleTags,
      helmetData,
      structuredData,
    } = await render(url);

    // Inject dehydrated state into HTML
    const stateScript = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(
      dehydratedState
    ).replace(/</g, "\\u003c")};</script>`;

    // Create structured data script if available
    const structuredDataScript = structuredData
      ? `\n    <script type="application/ld+json">${JSON.stringify(
          structuredData
        )}</script>`
      : "";

    // Inject metadata
    let html = template
      .replace(`<!--app-html-->`, rendered)
      .replace(`<!--app-styles-->`, styleTags)
      .replace(`</head>`, `${stateScript}${structuredDataScript}\n  </head>`);

    // Update meta tags with helmetData
    if (helmetData) {
      const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

      // Update title
      html = html.replace(
        /<title>.*?<\/title>/,
        `<title>${helmetData.title}</title>`
      );

      // Update og:type
      html = html.replace(
        /<meta property="og:type" content=".*?" \/>/,
        `<meta property="og:type" content="${
          helmetData.articleType || "website"
        }" />`
      );

      // Update og:title
      html = html.replace(
        /<meta property="og:title" content=".*?" \/>/,
        `<meta property="og:title" content="${helmetData.title}" />`
      );

      // Update description
      html = html.replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${helmetData.description}" />`
      );

      // Update og:description
      html = html.replace(
        /<meta property="og:description" content=".*?" \/>/,
        `<meta property="og:description" content="${helmetData.description}" />`
      );

      // Update og:url
      html = html.replace(
        /<meta property="og:url" content=".*?" \/>/,
        `<meta property="og:url" content="${fullUrl}" />`
      );

      // Update og:image
      html = html.replace(
        /<meta property="og:image" content=".*?" \/>/,
        `<meta property="og:image" content="${helmetData.imgUrl}" />`
      );

      // Add article-specific meta tags for articles
      if (helmetData.articleType === "article") {
        let articleTags = "";

        if (helmetData.datePublished) {
          articleTags += `\n    <meta property="article:published_time" content="${helmetData.datePublished}" />`;
        }

        if (helmetData.dateModified) {
          articleTags += `\n    <meta property="article:modified_time" content="${helmetData.dateModified}" />`;
        }

        if (helmetData.author) {
          articleTags += `\n    <meta property="article:author" content="${helmetData.author}" />`;
        }

        // Insert article tags before </head>
        if (articleTags) {
          html = html.replace("</head>", `${articleTags}\n  </head>`);
        }
      }
    }

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
