import type { NextFunction, Request, Response } from "express";
import { ALLOWED_HOSTS, INTERNAL_API_TOKEN, isProduction } from "../config.js";

export function bffSecurityMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // _internal API 보안 검증
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const userAgent = req.headers["user-agent"];
  const customHeader = req.headers["x-jiho-internal"];

  // 1. 커스텀 헤더 검증 (가장 강력한 방법)
  if (!customHeader || customHeader !== INTERNAL_API_TOKEN) {
    console.warn(
      `[SECURITY] _internal API 접근 거부 - 잘못된 내부 토큰: ${req.method} ${req.originalUrl} from ${req.ip}`
    );
    console.warn(`Expected: ${INTERNAL_API_TOKEN}, Received: ${customHeader}`);
    res.status(403).json({
      error: "Forbidden",
      message: "Internal API requires valid authentication",
    });
    return;
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
      res.status(403).json({
        error: "Forbidden",
        message: "Invalid content type for internal API",
      });
      return;
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
    res.status(403).json({
      error: "Forbidden",
      message: "Invalid user agent for internal API",
    });
    return;
  }

  // 4. Origin/Referer 이중 검증 (추가 보안층)
  const allowedOrigins = ALLOWED_HOSTS.map((h) => `http://${h}`).concat(
    ALLOWED_HOSTS.map((h) => `https://${h}`)
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
    res.status(403).json({
      error: "Forbidden",
      message: "Invalid origin for internal API",
    });
    return;
  }

  next();
}
