import type { Score, TechniqueResult, VideoHighlight } from "@/entities/video";
import { useCreateLabel } from "@/entities/video";
import type { FeedbackType } from "@/shared/ui/swipe-feedback";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

/** 기술성공 시 부여하는 점수. NONE(무점수)은 제외한 3단계. */
export type SuccessScore = Exclude<Score, "NONE">;

export const SCORE_OPTIONS: { value: SuccessScore; label: string }[] = [
  { value: "YUKO", label: "유효" },
  { value: "WAZA_ARI", label: "절반" },
  { value: "IPPON", label: "한판" },
];

/** 저장된 라벨의 점수를 선택 상태로 복원. 무점수/없음이면 기본값 절반. */
const initialScore = (score: Score | undefined): SuccessScore =>
  score === "YUKO" || score === "IPPON" ? score : "WAZA_ARI";

interface Params {
  highlight: VideoHighlight;
  /** 라벨 저장 후 잠시 뒤 다음 클립으로. */
  onLabeled: () => void;
  /** 라벨 저장 성공 — 해당 하이라이트를 '완료'로 표시(목록 유지). */
  onLabelSaved: (highlightId: number) => void;
}

/**
 * 하이라이트 라벨링 도메인 상태·액션. 기술명/점수/좋아요 선택과
 * 저장(기술성공/시도/없음)을 담당하고, 저장 결과에 따른 피드백을 노출한다.
 * 제스처(스와이프/탭) 인식과 카드 프레젠테이션은 위젯(shorts-card)이 담당.
 */
export const useLabelHighlight = ({
  highlight,
  onLabeled,
  onLabelSaved,
}: Params) => {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [liked, setLiked] = useState(false);
  const [technique, setTechnique] = useState<string | null>(
    highlight.currentUserLabel?.technique ?? null,
  );
  // 기술성공 시 부여할 점수(유효/절반/한판). 기본값 절반.
  const [score, setScore] = useState<SuccessScore>(() =>
    initialScore(highlight.currentUserLabel?.score),
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const mutation = useCreateLabel();

  const isAlreadyLabeled = highlight.isLabeledByCurrentUser;

  // 카드가 key 없이 유지되므로, 클립이 바뀌면 라벨 관련 상태를 여기서 초기화한다.
  useEffect(() => {
    setLiked(false);
    setTechnique(highlight.currentUserLabel?.technique ?? null);
    setScore(initialScore(highlight.currentUserLabel?.score));
    setFeedback(null);
    setSheetOpen(false);
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- 클립 id 변경 시에만 초기화
  }, [highlight.id]);

  const saveLabel = useCallback(
    (
      params: { techniqueResult: TechniqueResult; score: Score },
      advance = true,
    ): Promise<unknown> => {
      // advance=false 면 저장만 하고 이동은 호출자가(예: 위로 스와이프 애니메이션) 담당.
      return mutation
        .mutateAsync({
          highlightId: highlight.id,
          data: {
            techniqueResult: params.techniqueResult,
            score: params.score,
            technique,
            highlightScore: liked ? 8 : null,
            correctedEventSec: null,
            memo: null,
          },
        })
        .then((res) => {
          // 저장 성공 → '완료'로 표시(목록 유지). advance면 잠시 뒤 다음 클립으로.
          onLabelSaved(highlight.id);
          if (advance) setTimeout(onLabeled, 700);
          return res;
        })
        .catch((e) => {
          toast.error("저장 실패. 다시 시도해주세요.");
          throw e;
        });
    },
    [highlight.id, liked, mutation, onLabeled, onLabelSaved, technique],
  );

  // 왼쪽 스와이프 = 기술성공(선택 점수와 함께 저장).
  const saveSuccess = useCallback(() => {
    setFeedback("success");
    saveLabel({ techniqueResult: "SUCCESS", score });
  }, [saveLabel, score]);

  // 오른쪽 스와이프 = 기술시도(무점수 저장).
  const saveAttempt = useCallback(() => {
    setFeedback("attempt");
    saveLabel({ techniqueResult: "ATTEMPT", score: "NONE" });
  }, [saveLabel]);

  // 기술x 버튼 = 기술아님(NONE) 저장. 이동은 호출자(위로 스와이프 애니메이션)가 담당.
  const saveNone = useCallback(
    (): Promise<unknown> => saveLabel({ techniqueResult: "NONE", score: "NONE" }, false),
    [saveLabel],
  );

  // 좋아요 토글. 켤 때의 하트 애니메이션은 위젯(shorts-card)이 담당.
  const toggleLike = useCallback(() => setLiked((prev) => !prev), []);

  return {
    technique,
    setTechnique,
    score,
    setScore,
    liked,
    toggleLike,
    sheetOpen,
    setSheetOpen,
    feedback,
    setFeedback,
    isPending: mutation.isPending,
    isAlreadyLabeled,
    saveSuccess,
    saveAttempt,
    saveNone,
  };
};
