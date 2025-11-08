import type { Request, Response, NextFunction } from "express";

export function bffErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
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
