import axios from "axios";

import { refreshAdminSession } from "@/features/auth/api/auth";

// In dev, Vite proxies /api -> the backend (see vite.config.ts).
const api = axios.create({ baseURL: "/api/v2/admin", withCredentials: true });

/** 모델 학습용으로 내보내는 라벨 한 건(라벨 투표 1행 = 하이라이트 + 라벨 값). */
export interface LabelExportItem {
  labelId: number;
  highlightId: number;
  jobId: number;
  userId: number | null;
  techniqueResult: "NONE" | "ATTEMPT" | "SUCCESS";
  score: "NONE" | "YUKO" | "WAZA_ARI" | "IPPON" | null;
  technique: string | null;
  highlightScore: number | null;
  correctedEventSec: number | null;
  memo: string | null;
  eventSec: number;
  startSec: number;
  endSec: number;
  confidence: number;
  clipUrl: string;
  originalFilename: string;
  createdAt: string;
}

interface LabelsPage {
  total: number;
  limit: number;
  offset: number;
  items: LabelExportItem[];
}

const PAGE_SIZE = 500; // 서버 최대 limit

async function getPage(offset: number): Promise<LabelsPage> {
  const request = () =>
    api.get<LabelsPage>("/labels", { params: { limit: PAGE_SIZE, offset } });

  try {
    const { data } = await request();
    return data;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401)
      throw error;
    await refreshAdminSession();
    const { data } = await request();
    return data;
  }
}

/**
 * 전체 라벨을 페이지네이션으로 모두 수집한다(root 권한 필요).
 * onProgress 로 진행 상황(수집/전체)을 알린다.
 */
export async function fetchAllLabels(
  onProgress?: (loaded: number, total: number) => void,
): Promise<LabelExportItem[]> {
  const all: LabelExportItem[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const page = await getPage(offset);
    total = page.total;
    all.push(...page.items);
    offset += page.items.length;
    onProgress?.(all.length, page.total);
    if (page.items.length === 0) break; // 안전장치(무한 루프 방지)
  }

  return all;
}

export function labelsErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 403) {
      return "라벨 내보내기는 root 권한에서만 가능합니다.";
    }
    return error.response?.data?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
