import axios from "axios";

/**
 * 영상 라벨링 엔드포인트는 아직 swagger(orval) 생성 대상이 아니라서
 * admin 스코프(`/api/v2/admin`)로 직접 axios 호출한다.
 * baseURL 은 생성된 @packages/api 클라이언트와 동일 출처를 사용한다.
 */
const baseURL = `${import.meta.env.VITE_API_BASE_URL}/v2/admin`;

export const videoApi = axios.create({
  baseURL,
  withCredentials: true,
});

export type VideoJobStatus = "uploaded" | "processing" | "done" | "failed";
export type TechniqueResult = "NONE" | "ATTEMPT" | "SUCCESS";
export type Score = "NONE" | "YUKO" | "WAZA_ARI" | "IPPON";

export interface LatestVideoLabel {
  id: number;
  techniqueResult: TechniqueResult;
  score: Score | null;
  technique: string | null;
  highlightScore: number | null;
  correctedEventSec: number | null;
  memo: string | null;
  createdAt: string;
}

export interface VideoHighlight {
  id: number;
  jobId: number;
  eventSec: number;
  startSec: number;
  endSec: number;
  confidence: number;
  clipPath: string;
  clipUrl: string;
  createdAt: string;
  latestLabel: LatestVideoLabel | null;
}

export interface VideoJobListItem {
  id: number;
  originalFilename: string;
  status: VideoJobStatus;
  durationSec: number | null;
  errorMessage: string | null;
  highlightCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoJobDetail {
  id: number;
  originalFilename: string;
  originalPath: string;
  originalVideoUrl: string;
  eventsJsonPath: string;
  eventsJsonUrl: string;
  status: VideoJobStatus;
  durationSec: number | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  highlights: VideoHighlight[];
}

export interface CreateVideoLabelBody {
  techniqueResult: TechniqueResult;
  score?: Score | null;
  technique?: string | null;
  highlightScore?: number | null;
  correctedEventSec?: number | null;
  memo?: string | null;
}

export const getVideoJobs = async (): Promise<VideoJobListItem[]> => {
  const { data } = await videoApi.get<{ jobs: VideoJobListItem[] }>("/videos");
  return data.jobs;
};

export const getVideoJobDetail = async (
  jobId: number,
): Promise<VideoJobDetail> => {
  const { data } = await videoApi.get<{ job: VideoJobDetail }>(
    `/videos/${jobId}`,
  );
  return data.job;
};

export const createHighlightLabel = async (
  highlightId: number,
  body: CreateVideoLabelBody,
): Promise<{ labelId: number }> => {
  const { data } = await videoApi.post<{ labelId: number }>(
    `/highlights/${highlightId}/label`,
    body,
  );
  return data;
};
