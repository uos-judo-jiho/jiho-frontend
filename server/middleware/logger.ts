import type { Request, Response, NextFunction } from "express";

export function bffLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] BFF ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
}
