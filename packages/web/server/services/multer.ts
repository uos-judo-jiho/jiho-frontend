import multer from "multer";
import path from "path";
import { UPLOAD_MAX_SIZE, ALLOWED_EXTENSIONS } from "../config.js";

// Multer configuration for file uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: UPLOAD_MAX_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `허용되지 않는 파일 확장자입니다. 허용 확장자: ${ALLOWED_EXTENSIONS.join(
            ", ",
          )}`,
        ),
      );
    }
  },
});
