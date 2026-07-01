import type { Score, TechniqueResult, VideoHighlight } from "@/api/video";
import { useCreateLabel } from "@/hooks/use-highlights";
import { useOrientationMode } from "@/hooks/use-orientation";
import {
  SWIPE_THRESHOLD,
  useSwipe,
  type SwipeDirection,
} from "@/hooks/use-swipe";
import { cn } from "@/lib/utils";
import { Ban, Check, Heart, Smartphone, Tag } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  SwipeDragOverlay,
  SwipeFeedback,
  type FeedbackType,
} from "./swipe-feedback";
import { TechniqueSheet } from "./technique-sheet";

const CONTROLS_HIDE_DELAY = 3000;

/** 기술성공 시 부여하는 점수. NONE(무점수)은 제외한 3단계. */
type SuccessScore = Exclude<Score, "NONE">;

const SCORE_OPTIONS: { value: SuccessScore; label: string }[] = [
  { value: "YUKO", label: "유효" },
  { value: "WAZA_ARI", label: "절반" },
  { value: "IPPON", label: "한판" },
];

/** 저장된 라벨의 점수를 선택 상태로 복원. 무점수/없음이면 기본값 절반. */
const initialScore = (score: Score | undefined): SuccessScore =>
  score === "YUKO" || score === "IPPON" ? score : "WAZA_ARI";

interface Props {
  highlight: VideoHighlight;
  jobId: number;
  index: number;
  total: number;
  onLabeled: () => void;
  /** 위/아래 스와이프 확정 (위=다음, 아래=이전) — 라벨 없이 이동. */
  onVerticalSwipe: (direction: "up" | "down") => void;
  /** 수직 드래그 실시간 delta(px) — 페이지의 세로 피드 이동에 사용. */
  onVerticalDragMove: (deltaY: number) => void;
  /** 수직 드래그 취소(임계값 미달) — 원위치. */
  onVerticalDragCancel: () => void;
  /** 컨트롤(카운터·액션·라벨·하단바)을 렌더할 고정 레이어. 세로 피드 transform 밖. */
  controlsLayer: HTMLElement | null;
  /** 현재 클립의 <video> — 페이지의 지속(keyed) 슬롯에서 렌더하고 여기로 전달. */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** 좌우 라벨 드래그 실시간 delta(px) — 페이지가 현재 영상 슬롯을 이동시킨다. */
  onHorizontalDragMove: (deltaX: number) => void;
  /** 사용자가 조작을 시작함(idle 힌트 리셋용). */
  onInteract: () => void;
}

export const ShortsCard = ({
  highlight,
  jobId,
  index,
  total,
  onLabeled,
  onVerticalSwipe,
  onVerticalDragMove,
  onVerticalDragCancel,
  controlsLayer,
  videoRef,
  onHorizontalDragMove,
  onInteract,
}: Props) => {
  const { mode: orientationMode, toggle: toggleOrientation } =
    useOrientationMode();

  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [dragX, setDragX] = useState(0);
  const [liked, setLiked] = useState(false);
  const [technique, setTechnique] = useState<string | null>(
    highlight.currentUserLabel?.technique ?? null,
  );
  // 기술성공 시 부여할 점수(유효/절반/한판). 기본값 절반.
  const [score, setScore] = useState<SuccessScore>(() =>
    initialScore(highlight.currentUserLabel?.score),
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const mutation = useCreateLabel(jobId);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(
      () => setShowControls(false),
      CONTROLS_HIDE_DELAY,
    );
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [resetControlsTimer]);

  const saveLabel = useCallback(
    (params: { techniqueResult: TechniqueResult; score: Score }) => {
      mutation.mutate(
        {
          highlightId: highlight.id,
          data: {
            techniqueResult: params.techniqueResult,
            score: params.score,
            technique,
            highlightScore: liked ? 8 : null,
            correctedEventSec: null,
            memo: null,
          },
        },
        {
          onSuccess: () => {
            toast.success("저장됨");
            setTimeout(onLabeled, 700);
          },
          onError: () => toast.error("저장 실패. 다시 시도해주세요."),
        },
      );
    },
    [highlight.id, liked, mutation, onLabeled, technique],
  );

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      setDragX(0);
      onHorizontalDragMove(0);
      if (mutation.isPending) return;
      // 이미 라벨링된 클립은 좌우 어느 쪽으로 스와이프해도 다음으로 넘어간다.
      if (highlight.isLabeledByCurrentUser) {
        onLabeled();
        return;
      }
      if (direction === "right") {
        setFeedback("success");
        saveLabel({ techniqueResult: "SUCCESS", score });
      } else {
        setFeedback("attempt");
        saveLabel({ techniqueResult: "ATTEMPT", score: "NONE" });
      }
    },
    [
      highlight.isLabeledByCurrentUser,
      mutation.isPending,
      onLabeled,
      saveLabel,
      score,
      onHorizontalDragMove,
    ],
  );

  // 드래그 중: 손가락을 따라 영상 이동(페이지가 현재 슬롯을 이동). 라벨링 중엔 잠금.
  const handleDragMove = useCallback(
    (deltaX: number) => {
      if (mutation.isPending) return;
      setDragX(deltaX);
      onHorizontalDragMove(deltaX);
    },
    [mutation.isPending, onHorizontalDragMove],
  );

  // 임계값 미달로 손을 떼면 원위치.
  const handleDragCancel = useCallback(() => {
    setDragX(0);
    onHorizontalDragMove(0);
  }, [onHorizontalDragMove]);

  const handleDoubleTap = useCallback(() => {
    if (mutation.isPending || highlight.isLabeledByCurrentUser) return;
    setLiked((prev) => !prev);
    setFeedback("like");
  }, [highlight.isLabeledByCurrentUser, mutation.isPending]);

  const handleTap = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  }, [videoRef]);

  const {
    onTouchStart: swipeTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useSwipe({
    onSwipe: handleSwipe,
    // 수직 제스처는 페이지의 세로 피드(다음/이전 미리보기)로 위임한다.
    onVerticalSwipe,
    onVerticalDragMove,
    onVerticalDragCancel,
    onDoubleTap: handleDoubleTap,
    onTap: handleTap,
    onDragMove: handleDragMove,
    onDragCancel: handleDragCancel,
  });

  // 터치 시 컨트롤 타이머 리셋 후 스와이프 핸들러로 위임
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // 사용자가 조작을 시작하면 idle 스와이프 힌트를 끄도록 페이지에 알린다.
      onInteract();
      resetControlsTimer();
      swipeTouchStart(e);
    },
    [onInteract, resetControlsTimer, swipeTouchStart],
  );

  const isAlreadyLabeled = highlight.isLabeledByCurrentUser;

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* ── 터치 레이어 — 영상은 페이지의 지속(keyed) 슬롯에서 렌더된다 ── */}
      <div
        className="absolute inset-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* 실시간 스와이프 스탬프 (기술시도/기술성공 · 완료 클립은 다음) */}
      <SwipeDragOverlay
        dragX={dragX}
        threshold={SWIPE_THRESHOLD}
        labeled={isAlreadyLabeled}
      />

      {/* 일시정지 아이콘 */}
      {isPaused && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="rounded-full bg-black/40 p-5 backdrop-blur-sm">
            <svg
              className="h-10 w-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
            </svg>
          </div>
        </div>
      )}

      <SwipeFeedback feedback={feedback} onDone={() => setFeedback(null)} />

      {/* 컨트롤 레이어 — 세로 피드 transform 밖(#root)으로 포탈해 스크롤 시 고정 */}
      {controlsLayer &&
        createPortal(
          <>
            {/* 하단 그라데이션 — 컨트롤 표시 여부와 무관하게 항상 렌더 */}
            <div
              className={cn(
                "pointer-events-none fixed inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500",
                showControls ? "opacity-100" : "opacity-0",
              )}
            />

            {/* 상단 좌: 카운터 + 완료 뱃지 (항상 표시) */}
            <div className="fixed left-[calc(var(--safe-left)+1rem)] top-[calc(var(--safe-top)+1rem)] z-20 flex flex-col gap-2">
              {/* 가로 <-> 세로 모드 전환 */}
              <button
                type="button"
                onClick={toggleOrientation}
                aria-label={
                  orientationMode === "landscape"
                    ? "세로 모드로 전환"
                    : "가로 모드로 전환"
                }
                className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-60 backdrop-blur-sm transition-opacity hover:opacity-100"
              >
                <Smartphone
                  className={cn(
                    "h-4 w-4",
                    orientationMode === "landscape" && "rotate-90",
                  )}
                />
                {orientationMode === "landscape" ? "세로" : "가로"}
              </button>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {index + 1} / {total}
                </div>
                {isAlreadyLabeled && (
                  <div className="flex items-center gap-1 rounded-full bg-green-500/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    <Check className="h-3 w-3" />
                    완료
                  </div>
                )}
              </div>
            </div>

            {/* 우측: 액션 버튼 (항상 표시 — 기술명 선택은 의도적 행동) */}
            <div className="fixed right-[calc(var(--safe-right)+0.75rem)] bottom-[calc(var(--safe-bottom)+56px+12px)] z-20 flex flex-col items-center gap-3">
              {/* 기술없음 — 누르면 '기술아님(NONE)'으로 저장하고 다음으로 넘어간다. */}
              <button
                type="button"
                disabled={mutation.isPending}
                onClick={() => {
                  if (mutation.isPending) return;
                  if (isAlreadyLabeled) {
                    onLabeled();
                    return;
                  }
                  setFeedback("none");
                  saveLabel({ techniqueResult: "NONE", score: "NONE" });
                }}
                className="flex flex-col items-center gap-1 text-white transition-transform active:scale-90 disabled:opacity-40 bg-black/20 rounded-xl p-2"
              >
                <Ban className="h-4 w-4 drop-shadow-md" strokeWidth={1.5} />
                <span className="text-xs font-medium drop-shadow">기술 x</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isAlreadyLabeled && !mutation.isPending)
                    setLiked((prev) => !prev);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 transition-transform active:scale-90 disabled:opacity-40 bg-black/20 rounded-xl p-2",
                  liked ? "text-pink-400" : "text-white",
                )}
              >
                <Heart
                  className="h-4 w-4 drop-shadow-md"
                  fill={liked ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
                <span className="text-xs font-medium drop-shadow">좋아요</span>
              </button>

              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-transform active:scale-90 bg-black/20 rounded-xl p-2",
                  technique ? "text-indigo-400" : "text-white",
                )}
              >
                <Tag className="h-4 w-4 drop-shadow-md" strokeWidth={1.5} />
                <span className="text-xs font-medium drop-shadow">
                  {technique ? "변경" : "기술명"}
                </span>
              </button>

              {/* 점수(유효/절반/한판) — 기술성공 시 부여할 점수를 선택. 라벨링 전에만 노출 */}
              {!isAlreadyLabeled && (
                <div className="flex flex-col overflow-hidden rounded-xl border border-white/20 bg-black/40 backdrop-blur-sm">
                  {SCORE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={mutation.isPending}
                      onClick={() => setScore(opt.value)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-40",
                        score === opt.value
                          ? "bg-amber-400 text-black"
                          : "text-white/80 hover:bg-white/10",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 하단 좌: 기술명 태그 + 메타 */}
            <div
              className={cn(
                "pointer-events-none fixed bottom-[calc(var(--safe-bottom)+3.5rem)] left-[calc(var(--safe-left)+1rem)] right-[calc(var(--safe-right)+4rem)] z-20 transition-opacity duration-500",
                showControls ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                {technique && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    <Tag className="h-3 w-3" />
                    {technique}
                  </div>
                )}
              </div>
            </div>

            {/* 하단 버튼 바 — 터치 시 등장, 3초 후 자동 숨김 */}
            <div
              className={cn(
                "fixed inset-x-0 bottom-0 z-20 transition-all duration-500",
                showControls
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0",
              )}
            >
              {!isAlreadyLabeled ? (
                <div className="grid grid-cols-2 border-t border-white/10 bg-black/70 pb-safe backdrop-blur-sm">
                  <button
                    type="button"
                    disabled={mutation.isPending}
                    onClick={() => {
                      setFeedback("attempt");
                      saveLabel({ techniqueResult: "ATTEMPT", score: "NONE" });
                    }}
                    className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-amber-400 transition-colors hover:bg-white/5 active:bg-white/10 disabled:opacity-40"
                  >
                    <span className="text-lg">👈</span>
                    기술시도
                  </button>
                  <button
                    type="button"
                    disabled={mutation.isPending}
                    onClick={() => {
                      setFeedback("success");
                      saveLabel({ techniqueResult: "SUCCESS", score });
                    }}
                    className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-green-400 transition-colors hover:bg-white/5 active:bg-white/10 disabled:opacity-40"
                  >
                    기술성공
                    <span className="text-lg">👉</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-black/70 pt-3.5 pb-[calc(0.875rem+var(--safe-bottom))] text-sm text-neutral-400 backdrop-blur-sm">
                  <Check className="h-4 w-4 text-green-400" />
                  라벨링 완료 · 스와이프해서 다음으로
                </div>
              )}
            </div>
          </>,
          controlsLayer,
        )}

      <TechniqueSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={setTechnique}
        selected={technique}
      />
    </div>
  );
};
