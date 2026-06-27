import axios from "axios";

import { refreshAdminSession } from "@/features/auth/api/auth";

// In dev, Vite proxies /sidecar -> the local Node sidecar (see vite.config.ts).
const sidecar = axios.create({ baseURL: "/sidecar" });

export const MAX_ORIGINAL_UPLOAD_BYTES = 60 * 1024 * 1024;

/** React Query key for the sidecar processing queue. */
export const QUEUE_QUERY_KEY = ["sidecar-queue"] as const;

export type ItemStatus = "queued" | "processing" | "done" | "failed";

export interface ProcessedHighlight {
  index: number;
  eventSec: number;
  startSec: number;
  endSec: number;
  confidence: number;
  /** Sidecar URL to preview this clip in the browser. */
  clipUrl: string;
}

export interface QueueItem {
  id: string;
  originalFilename: string;
  status: ItemStatus;
  createdAt: string;
  durationSec: number | null;
  hasOriginal: boolean;
  error: string | null;
  highlights: ProcessedHighlight[];
}

export interface QueueState {
  items: QueueItem[];
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

/** Preview URLs must hit the proxied /sidecar route. */
function withClipPrefix(state: QueueState): QueueState {
  return {
    items: state.items.map((item) => ({
      ...item,
      highlights: item.highlights.map((h) => ({
        ...h,
        clipUrl: h.clipUrl.startsWith("/sidecar")
          ? h.clipUrl
          : `/sidecar${h.clipUrl}`,
      })),
    })),
  };
}

/** Queue one or more local videos for sequential worker processing. */
export async function processVideos(
  files: File[],
  onProgress?: (percent: number) => void,
): Promise<QueueState> {
  const form = new FormData();
  for (const file of files) form.append("videos", file);

  const { data } = await sidecar.post<QueueState>("/process", form, {
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
  return withClipPrefix(data);
}

/** Current queue state (queued / processing / done-not-uploaded items). */
export async function fetchQueue(): Promise<QueueState> {
  const { data } = await sidecar.get<QueueState>("/queue");
  return withClipPrefix(data);
}

/** Upload one finished item to the real API; deletes its cache on success. */
export async function uploadItem(
  id: string,
  uploadOriginal = false,
): Promise<UploadResult> {
  const upload = () =>
    sidecar.post<UploadResult>("/upload", { id, uploadOriginal });

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

/** Drop a queued/finished/failed item and delete its cached files. */
export async function discardItem(id: string): Promise<void> {
  await sidecar.delete(`/queue/${encodeURIComponent(id)}`);
}

export function downloadHighlights(id: string): void {
  const link = document.createElement("a");
  link.href = `/sidecar/download/${encodeURIComponent(id)}`;
  link.click();
}
