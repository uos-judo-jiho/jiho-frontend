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

// Create http server
const app = express();

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
  app.use(vite.middlewares);
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
