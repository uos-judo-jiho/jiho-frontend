import { internalAxiosInstance } from "@/shared/lib/api/config";

export interface UploadResponse {
  success: boolean;
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  files: UploadResponse[];
}

export interface PresignedUrlResponse {
  success: boolean;
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

export interface UploadConfig {
  maxSize: number;
  allowedExtensions: string[];
  bucket: string | null;
  configured: boolean;
}

export interface UploadProgress {
  uploadId: string;
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  error?: string;
}

export interface UploadStartResponse {
  uploadId: string;
  sseToken: string;
  message: string;
  fileCount?: number;
}

export class InternalUploadClient {
  async uploadFile(
    file: File,
    folder: string = "uploads",
  ): Promise<UploadStartResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await internalAxiosInstance.post(
      "/_internal/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  async uploadMultipleFiles(
    files: File[],
    folder: string = "uploads",
  ): Promise<UploadStartResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("folder", folder);

    const response = await internalAxiosInstance.post(
      "/_internal/api/upload/multiple",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  async generatePresignedUrl(
    fileName: string,
    folder: string = "uploads",
    expiresIn: number = 3600,
  ): Promise<PresignedUrlResponse> {
    const response = await internalAxiosInstance.post(
      `/_internal/api/upload-url/${fileName}`,
      {
        folder,
        expiresIn,
      },
    );

    return response.data;
  }

  async getUploadConfig(): Promise<UploadConfig> {
    const response = await internalAxiosInstance.get(
      "/_internal/api/upload/config",
    );
    return response.data;
  }

  createUploadEventSource(uploadId: string, sseToken: string): EventSource {
    const url = new URL(
      "/_internal/api/upload/progress",
      window.location.origin,
    );
    url.searchParams.set("uploadId", uploadId);
    url.searchParams.set("token", sseToken);

    return new EventSource(url.toString());
  }

  async cancelUpload(uploadId: string): Promise<void> {
    await internalAxiosInstance.delete(`/_internal/api/upload/${uploadId}`);
  }
}

export const uploadClient = new InternalUploadClient();
