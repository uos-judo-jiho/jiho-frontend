import type { Request, Response } from "express";
import { BACKEND_URL } from "../config.js";

export async function proxyToBackend(
  path: string,
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const queryString = new URLSearchParams(
      req.query as Record<string, string>,
    ).toString();
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
      response.headers.get("content-type") || "application/json",
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
