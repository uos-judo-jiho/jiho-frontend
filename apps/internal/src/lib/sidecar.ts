import axios from "axios";

import { refreshAdminSession } from "@/lib/auth";

// In dev, Vite proxies /sidecar -> the local Node sidecar (see vite.config.ts).
const sidecar = axios.create({ baseURL: "/sidecar" });

export const MAX_ORIGINAL_UPLOAD_BYTES = 60 * 1024 * 1024;

export interface ProcessedHighlight {
  index: number;
  eventSec: number;
  startSec: number;
  endSec: number;
  confidence: number;
  /** Sidecar URL to preview this clip in the browser. */
  clipUrl: string;
}

export interface ProcessResult {
  sessionId: string;
  originalFilename: string;
  durationSec: number | null;
  highlights: ProcessedHighlight[];
}

export interface UploadResult {
  jobId: number;
  uploadedClips: number;
  uploadedOriginal: boolean;
}

export function sidecarErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

/** Send a local video to the sidecar, which runs the Python worker on it. */
export async function processVideo(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<ProcessResult> {
  const form = new FormData();
  form.append("video", file);

  const { data } = await sidecar.post<ProcessResult>("/process", form, {
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

  // Prefix preview URLs so the browser hits the proxied sidecar route.
  return {
    ...data,
    highlights: data.highlights.map((h) => ({
      ...h,
      clipUrl: `/sidecar${h.clipUrl}`,
    })),
  };
}

/**
 * Ask the sidecar to upload the processed highlights to the real API.
 * When `uploadOriginal` is true the source video is uploaded too (default false).
 */
export async function uploadSession(
  sessionId: string,
  uploadOriginal = false,
): Promise<UploadResult> {
  const upload = () =>
    sidecar.post<UploadResult>("/upload", { sessionId, uploadOriginal });

  try {
    const { data } = await upload();
    return data;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401)
      throw error;
    await refreshAdminSession();
    const { data } = await upload();
    return data;
  }
}

export function downloadHighlights(sessionId: string): void {
  const link = document.createElement("a");
  link.href = `/sidecar/download/${encodeURIComponent(sessionId)}`;
  link.click();
}
