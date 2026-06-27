/**
 * 영상 라벨링 화면에서 쓰는 도메인 타입.
 *
 * orval 생성 모델(@packages/api 의 GetApiV2AdminVideos... 류)과 형태가 동일하지만,
 * 해당 모델 타입은 v2Admin 네임스페이스로 재노출되지 않아 직접 import 할 수 없다.
 * 따라서 컴포넌트 prop 타입은 여기서 명시적으로 유지한다.
 * 실제 데이터 패칭/라벨 저장은 `./hooks` 의 생성 훅을 사용한다.
 */

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

export interface CreateVideoLabelBody {
  techniqueResult: TechniqueResult;
  score?: Score | null;
  technique?: string | null;
  highlightScore?: number | null;
  correctedEventSec?: number | null;
  memo?: string | null;
}
