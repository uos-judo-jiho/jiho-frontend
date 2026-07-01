import { apiClient } from "./client";

export interface VideoJobListItem {
  id: number;
  originalFilename: string;
  status: string;
  highlightCount: number;
  createdAt: string;
}

export interface VideoHighlightRaw {
  id: number;
  clipUrl: string;
  startSec: number;
  endSec: number;
  eventSec: number;
  confidence: number;
  currentUserLabel: CurrentUserLabel | null;
}

export interface VideoEvent {
  highlightId: number;
  isLabeledByCurrentUser: boolean;
}

export interface VideoHighlight extends VideoHighlightRaw {
  isLabeledByCurrentUser: boolean;
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

export const getVideoJobs = async (): Promise<VideoJobListItem[]> => {
  const res = await apiClient.get<{ jobs: VideoJobListItem[] }>("/videos");
  return res.data.jobs;
};

export const getVideoJobDetail = async (jobId: number): Promise<{ highlights: VideoHighlightRaw[] }> => {
  const res = await apiClient.get<{ job: { highlights: VideoHighlightRaw[] } }>(`/videos/${jobId}`);
  return res.data.job;
};

export const getVideoEvents = async (jobId: number): Promise<VideoEvent[]> => {
  const res = await apiClient.get<{ events: VideoEvent[] }>(`/videos/${jobId}/events`);
  return res.data.events;
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
