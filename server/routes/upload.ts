import express, { type Request, type Response, type NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_MAX_SIZE, ALLOWED_EXTENSIONS, S3_BUCKET } from "../config.js";
import { upload } from "../services/multer.js";
import { uploadToS3, generatePresignedUrl } from "../services/s3-upload.js";
import { generateSSEToken } from "../utils/sse-tokens.js";
import { uploadProgressMap } from "../utils/upload-progress.js";

const router = express.Router();

// S3 File Upload Routes - Async with progress tracking
router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({
          error: "파일이 제공되지 않았습니다.",
        });
        return;
      }

      if (!S3_BUCKET) {
        res.status(500).json({
          error: "S3 설정이 구성되지 않았습니다.",
        });
        return;
      }

      const folder = req.body.folder || "uploads";
      const uploadId = uuidv4();

      // SSE 임시 토큰 생성
      const sseToken = generateSSEToken(uploadId, req.ip || "");

      // 즉시 uploadId와 SSE 토큰 반환하여 클라이언트가 차단되지 않도록 함
      res.json({
        uploadId,
        sseToken,
        message: "업로드가 시작되었습니다.",
      });

      // 백그라운드에서 비동기 업로드 수행
      uploadToS3(req.file, folder, uploadId).catch((error) => {
        console.error("Background upload error:", error);
      });
    } catch (error) {
      console.error("Upload error:", error);
      next(error);
    }
  }
);

// Multiple file upload - Async with progress tracking
router.post(
  "/upload/multiple",
  upload.array("files", 10),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({
          error: "파일이 제공되지 않았습니다.",
        });
        return;
      }

      if (!S3_BUCKET) {
        res.status(500).json({
          error: "S3 설정이 구성되지 않았습니다.",
        });
        return;
      }

      const folder = req.body.folder || "uploads";
      const uploadId = uuidv4();

      // SSE 임시 토큰 생성
      const sseToken = generateSSEToken(uploadId, req.ip || "");

      // 즉시 uploadId와 SSE 토큰 반환하여 클라이언트가 차단되지 않도록 함
      res.json({
        uploadId,
        sseToken,
        message: "다중 업로드가 시작되었습니다.",
        fileCount: req.files.length,
      });

      // 백그라운드에서 비동기 다중 업로드 수행
      Promise.all(
        req.files.map((file, index) =>
          uploadToS3(file, folder, `${uploadId}-${index}`)
        )
      )
        .then((results) => {
          uploadProgressMap.set(uploadId, {
            uploadId,
            fileName: `${req.files!.length}개 파일`,
            progress: 100,
            status: "completed",
            files: results,
          });
        })
        .catch((error) => {
          console.error("Background multiple upload error:", error);
          uploadProgressMap.set(uploadId, {
            uploadId,
            fileName: `${(req.files as Express.Multer.File[]).length}개 파일`,
            progress: 0,
            status: "error",
            error: error.message,
          });
        });
    } catch (error) {
      console.error("Multiple upload error:", error);
      next(error);
    }
  }
);

// Generate presigned URL for direct client upload
router.post(
  "/upload-url/:fileName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileName } = req.params;
      const { folder = "uploads", expiresIn = 3600 } = req.body;

      if (!S3_BUCKET) {
        res.status(500).json({
          error: "S3 설정이 구성되지 않았습니다.",
        });
        return;
      }

      const result = await generatePresignedUrl(fileName, folder, expiresIn);
      res.json(result);
    } catch (error) {
      console.error("Presigned URL error:", error);
      next(error);
    }
  }
);

// Get upload configuration
router.get("/upload/config", (req: Request, res: Response) => {
  res.json({
    maxSize: UPLOAD_MAX_SIZE,
    allowedExtensions: ALLOWED_EXTENSIONS,
    bucket: S3_BUCKET ? S3_BUCKET.replace(/^(.{3}).*(.{3})$/, "$1***$2") : null,
    configured: !!S3_BUCKET,
  });
});

// Upload cancellation endpoint
router.delete("/upload/:uploadId", (req: Request, res: Response) => {
  const { uploadId } = req.params;

  if (uploadProgressMap.has(uploadId)) {
    uploadProgressMap.delete(uploadId);
    res.json({ success: true, message: "Upload cancelled" });
  } else {
    res.status(404).json({ error: "Upload not found" });
  }
});

export default router;
