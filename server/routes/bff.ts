import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { proxyToBackend } from "../services/proxy.js";

const router = express.Router();

// BFF Internal API Routes
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "BFF Internal Routes",
    timestamp: new Date().toISOString(),
  });
});

router.get("/api", (req: Request, res: Response) => {
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

// BFF API Routes - News
router.use(
  "/api/news*",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const path = req.params[0] || "";
      await proxyToBackend(`/news${path}`, req, res);
    } catch (error) {
      next(error);
    }
  }
);

// BFF API Routes - Notices
router.use(
  "/api/notices*",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const path = req.params[0] || "";
      await proxyToBackend(`/notice${path}`, req, res);
    } catch (error) {
      next(error);
    }
  }
);

// BFF API Routes - Trainings
router.use(
  "/api/trainings*",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const path = req.params[0] || "";
      await proxyToBackend(`/trainings${path}`, req, res);
    } catch (error) {
      next(error);
    }
  }
);

// BFF API Routes - Admin
router.use(
  "/api/admin*",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const path = req.params[0] || "";
      await proxyToBackend(`/admin${path}`, req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
