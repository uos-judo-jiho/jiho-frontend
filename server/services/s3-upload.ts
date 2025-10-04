import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { s3Client, S3_BUCKET } from "../config.js";
import type { S3UploadResult, PresignedUrlResult } from "../types.js";
import { uploadProgressMap } from "../utils/upload-progress.js";

export async function uploadToS3(
  file: Express.Multer.File,
  folder: string = "uploads",
  uploadId: string | null = null
): Promise<S3UploadResult> {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileName = `${folder}/${uuidv4()}${fileExtension}`;

  if (uploadId) {
    uploadProgressMap.set(uploadId, {
      uploadId,
      fileName: file.originalname,
      progress: 0,
      status: "uploading",
    });
  }

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });

  try {
    if (uploadId) {
      uploadProgressMap.set(uploadId, {
        uploadId,
        fileName: file.originalname,
        progress: 50,
        status: "uploading",
      });
    }

    await s3Client.send(command);

    const fileUrl = `https://${S3_BUCKET}.s3.${
      process.env.AWS_REGION || "ap-northeast-2"
    }.amazonaws.com/${fileName}`;

    const result: S3UploadResult = {
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };

    if (uploadId) {
      uploadProgressMap.set(uploadId, {
        uploadId,
        fileName: file.originalname,
        progress: 100,
        status: "completed",
        url: fileUrl,
      });
    }

    return result;
  } catch (error) {
    console.error("S3 Upload error:", error);

    if (uploadId) {
      uploadProgressMap.set(uploadId, {
        uploadId,
        fileName: file.originalname,
        progress: 0,
        status: "error",
        error: (error as Error).message,
      });
    }

    throw new Error("S3 업로드에 실패했습니다.");
  }
}

export async function generatePresignedUrl(
  fileName: string,
  folder: string = "uploads",
  expiresIn: number = 3600
): Promise<PresignedUrlResult> {
  const key = `${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ACL: "public-read",
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      uploadUrl: signedUrl,
      fileUrl: `https://${S3_BUCKET}.s3.${
        process.env.AWS_REGION || "ap-northeast-2"
      }.amazonaws.com/${key}`,
      key: key,
    };
  } catch (error) {
    console.error("Presigned URL generation error:", error);
    throw new Error("Presigned URL 생성에 실패했습니다.");
  }
}
