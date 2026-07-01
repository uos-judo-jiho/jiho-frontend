import { apiClient } from "./client";

export interface VideoHighlightRaw {
  id: number;
  clipUrl: string;
  startSec: number;
  endSec: number;
  eventSec: number;
  confidence: number;
  currentUserLabel: CurrentUserLabel | null;
}

export interface VideoHighlight extends VideoHighlightRaw {
  isLabeledByCurrentUser: boolean;
}

/** 미라벨 하이라이트 피드 항목 — 잡 정보(jobId·제목)를 함께 담는다. */
export interface FeedHighlight extends VideoHighlight {
  jobId: number;
  originalFilename: string;
}

/** 서버가 내려주는 미라벨 하이라이트 원본(커서 페이지네이션 항목). */
interface UnlabeledHighlightItem {
  highlightId: number;
  jobId: number;
  eventSec: number;
  startSec: number;
  endSec: number;
  confidence: number;
  clipPath: string;
  clipUrl: string;
  originalFilename: string;
  createdAt: string;
}

export interface UnlabeledHighlightsPage {
  items: FeedHighlight[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface CurrentUserLabel {
  techniqueResult: TechniqueResult;
  score: Score;
  technique: string | null;
  highlightScore: number | null;
  correctedEventSec: number | null;
  memo: string | null;
}

export type TechniqueResult = "NONE" | "ATTEMPT" | "SUCCESS";
export type Score = "NONE" | "YUKO" | "WAZA_ARI" | "IPPON";

export interface CreateLabelBody {
  techniqueResult: TechniqueResult;
  score: Score;
  technique: string | null;
  highlightScore: number | null;
  correctedEventSec: number | null;
  memo: string | null;
}

/**
 * 로그인 사용자가 아직 라벨링하지 않은 하이라이트를 커서 페이지네이션으로 조회.
 * jobId가 필요 없는 플랫 피드. 서버 스키마(highlightId)를 앱 공통 형태(id)로 매핑한다.
 */
export const getUnlabeledHighlights = async (
  cursor?: number,
  limit = 20,
): Promise<UnlabeledHighlightsPage> => {
  const res = await apiClient.get<{
    items: UnlabeledHighlightItem[];
    nextCursor: number | null;
    hasMore: boolean;
  }>("/highlights/unlabeled", { params: { cursor, limit } });

  return {
    items: res.data.items.map((it) => ({
      id: it.highlightId,
      jobId: it.jobId,
      clipUrl: it.clipUrl,
      startSec: it.startSec,
      endSec: it.endSec,
      eventSec: it.eventSec,
      confidence: it.confidence,
      originalFilename: it.originalFilename,
      currentUserLabel: null,
      isLabeledByCurrentUser: false,
    })),
    nextCursor: res.data.nextCursor,
    hasMore: res.data.hasMore,
  };
};

export const createHighlightLabel = async (
  highlightId: number,
  data: CreateLabelBody,
): Promise<void> => {
  await apiClient.post(`/highlights/${highlightId}/label`, data);
};

export const getMe = async (): Promise<{ role: string }> => {
  const res = await apiClient.get<{ user: { role: string } }>("/me");
  return res.data.user;
};
