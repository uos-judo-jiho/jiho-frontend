import { createFileRoute } from "@tanstack/react-router";

import {
  ALLOWED_HOSTS,
  getBackendBaseUrl,
  INTERNAL_API_TOKEN,
  isProduction,
  serverConsole,
} from "@/server/config";

/**
 * BFF 내부 API (기존 express server/routes/bff.ts + middleware/security.ts 이식).
 * 경로: /_internal/*
 */

const forbidden = (message: string) =>
  Response.json({ error: "Forbidden", message }, { status: 403 });

/** 기존 bffSecurityMiddleware 이식 */
const validateInternalRequest = (request: Request): Response | null => {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");
  const customHeader = request.headers.get("x-jiho-internal");

  // 1. 커스텀 헤더 검증 (가장 강력한 방법)
  if (!customHeader || customHeader !== INTERNAL_API_TOKEN) {
    serverConsole.warn(
      `[SECURITY] _internal API 접근 거부 - 잘못된 내부 토큰: ${request.method} ${request.url}`,
    );
    return forbidden("Internal API requires valid authentication");
  }

  // 2. Content-Type 검증 (POST/PUT 요청의 경우)
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const contentType = request.headers.get("content-type");
    if (
      !contentType ||
      (!contentType.includes("application/json") &&
        !contentType.includes("multipart/form-data"))
    ) {
      serverConsole.warn(
        `[SECURITY] _internal API 접근 거부 - 잘못된 Content-Type: ${contentType}`,
      );
      return forbidden("Invalid content type for internal API");
    }
  }

  // 3. User-Agent 검증 (기본적인 필터링)
  if (
    !userAgent ||
    userAgent.includes("curl") ||
    userAgent.includes("wget") ||
    userAgent.includes("Postman")
  ) {
    serverConsole.warn(
      `[SECURITY] _internal API 접근 거부 - 의심스러운 User-Agent: ${userAgent}`,
    );
    return forbidden("Invalid user agent for internal API");
  }

  // 4. Origin/Referer 이중 검증 (추가 보안층)
  const allowedOrigins = ALLOWED_HOSTS.map((h) => `http://${h}`).concat(
    ALLOWED_HOSTS.map((h) => `https://${h}`),
  );

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
    } catch {
      // Invalid referer URL
    }
  }

  if (!validOrigin) {
    serverConsole.warn(
      `[SECURITY] _internal API 접근 거부 - 잘못된 Origin/Referer: ${
        origin || referer
      }`,
    );
    return forbidden("Invalid origin for internal API");
  }

  return null;
};

/** 기존 services/proxy.ts 의 proxyToBackend 이식 */
const proxyToBackend = async (path: string, request: Request) => {
  try {
    const requestUrl = new URL(request.url);
    const fullUrl = `${getBackendBaseUrl()}/api${path}${requestUrl.search}`;

    const authorization = request.headers.get("authorization");

    const response = await fetch(fullUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("user-agent") || "jiho-bff-proxy",
        ...(authorization && { Authorization: authorization }),
      },
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : await request.text(),
    });

    const data = await response.text();

    const headers = new Headers({
      "Content-Type":
        response.headers.get("content-type") || "application/json",
    });

    for (const header of ["cache-control", "etag", "last-modified"]) {
      const value = response.headers.get(header);
      if (value) {
        headers.set(header, value);
      }
    }

    return new Response(data, { status: response.status, headers });
  } catch (error) {
    serverConsole.error("BFF Proxy error:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        message: "Failed to proxy request to backend",
      },
      { status: 500 },
    );
  }
};

const handleInternalRequest = async (request: Request, splat: string) => {
  const denied = validateInternalRequest(request);
  if (denied) {
    return denied;
  }

  serverConsole.info(`[BFF] ${request.method} /_internal/${splat}`);

  if (splat === "health") {
    return Response.json({
      status: "OK",
      service: "BFF Internal Routes",
      timestamp: new Date().toISOString(),
    });
  }

  if (splat === "api" || splat === "api/") {
    return Response.json({
      message: "Jiho BFF Internal API",
      version: "1.0.0",
      endpoints: {
        news: "/_internal/api/news/:year",
        notices: "/_internal/api/notices",
        trainings: "/_internal/api/trainings?year=<year>",
        admin: "/_internal/api/admin",
      },
    });
  }

  const proxyTargets: Array<{ prefix: string; backendPath: string }> = [
    { prefix: "api/news", backendPath: "/news" },
    { prefix: "api/notices", backendPath: "/notice" },
    { prefix: "api/trainings", backendPath: "/trainings" },
    { prefix: "api/admin", backendPath: "/admin" },
  ];

  for (const { prefix, backendPath } of proxyTargets) {
    if (splat === prefix || splat.startsWith(`${prefix}/`)) {
      const rest = splat.slice(prefix.length);
      return proxyToBackend(`${backendPath}${rest}`, request);
    }
  }

  return Response.json(
    { error: "Not Found", message: `Unknown internal route: /${splat}` },
    { status: 404 },
  );
};

export const Route = createFileRoute("/_internal/$")({
  server: {
    handlers: {
      ANY: ({ request, params }) =>
        handleInternalRequest(request, params._splat ?? ""),
    },
  },
});
