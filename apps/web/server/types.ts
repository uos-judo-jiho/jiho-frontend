export interface ConsolePrefix {
  LOG: string;
  INFO: string;
  ERROR: string;
  WARN: string;
}

export interface UploadProgress {
  uploadId: string;
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  error?: string;
  files?: any[];
}

export interface SSETokenData {
  token: string;
  createdAt: number;
  expiresAt: number;
  ipAddress: string;
  used: boolean;
}

export interface TokenValidation {
  valid: boolean;
  reason?: string;
}

export interface S3UploadResult {
  success: boolean;
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface PresignedUrlResult {
  success: boolean;
  uploadUrl: string;
  fileUrl: string;
  key: string;
}
