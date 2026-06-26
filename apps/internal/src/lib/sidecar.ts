import axios from "axios";

// In dev, Vite proxies /sidecar -> the local Node sidecar (see vite.config.ts).
const sidecar = axios.create({ baseURL: "/sidecar" });

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
    highlights: data.highlights.map((h) => ({ ...h, clipUrl: `/sidecar${h.clipUrl}` })),
  };
}

/** Ask the sidecar to upload the processed highlights to the real API. */
export async function uploadSession(sessionId: string): Promise<UploadResult> {
  const { data } = await sidecar.post<UploadResult>("/upload", { sessionId });
  return data;
}
