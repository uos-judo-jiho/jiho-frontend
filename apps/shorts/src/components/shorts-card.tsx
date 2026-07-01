import type { Score, TechniqueResult, VideoHighlight } from "@/api/video";
import { useCreateLabel } from "@/hooks/use-highlights";
import {
  SWIPE_THRESHOLD,
  useSwipe,
  type SwipeDirection,
} from "@/hooks/use-swipe";
import { cn } from "@/lib/utils";
import { Check, Heart, Tag } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

const scoreLabel = (score: SuccessScore) =>
  SCORE_OPTIONS.find((o) => o.value === score)?.label ?? "";

/** 저장된 라벨의 점수를 선택 상태로 복원. 무점수/없음이면 기본값 절반. */
const initialScore = (score: Score | undefined): SuccessScore =>
  score === "YUKO" || score === "IPPON" ? score : "WAZA_ARI";

interface Props {
  highlight: VideoHighlight;
  jobId: number;
  index: number;
  total: number;
  onLabeled: () => void;
}

export const ShortsCard = ({
  highlight,
  jobId,
  index,
  total,
  onLabeled,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
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
    ],
  );

  // 드래그 중: 손가락을 따라 카드 이동. 라벨링 중(mutation)일 땐 잠금.
  const handleDragMove = useCallback(
    (deltaX: number) => {
      if (mutation.isPending) return;
      setDragX(deltaX);
    },
    [mutation.isPending],
  );

  // 임계값 미달로 손을 떼면 원위치.
  const handleDragCancel = useCallback(() => setDragX(0), []);

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
  }, []);

  const {
    onTouchStart: swipeTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useSwipe({
    onSwipe: handleSwipe,
    onDoubleTap: handleDoubleTap,
    onTap: handleTap,
    onDragMove: handleDragMove,
    onDragCancel: handleDragCancel,
  });

  // 터치 시 컨트롤 타이머 리셋 후 스와이프 핸들러로 위임
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      resetControlsTimer();
      swipeTouchStart(e);
    },
    [resetControlsTimer, swipeTouchStart],
  );

  const isAlreadyLabeled = highlight.isLabeledByCurrentUser;
  const clipDuration = (highlight.endSec - highlight.startSec).toFixed(1);
  const confidence = (highlight.confidence * 100).toFixed(0);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      {/* ── 영상 (full-screen) — 드래그 시 손가락을 따라 이동 ── */}
      <div
        className="absolute inset-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX * 0.02}deg)`,
          transition:
            dragX === 0 ? "transform 0.25s cubic-bezier(0.16,1,0.3,1)" : "none",
        }}
      >
        <video
          ref={videoRef}
          src={highlight.clipUrl}
          autoPlay
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-contain"
        />
      </div>

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

      {/* 하단 그라데이션 — 컨트롤 표시 여부와 무관하게 항상 렌더 */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500",
          showControls ? "opacity-100" : "opacity-0",
        )}
      />

      {/* 상단 좌: 카운터 + 완료 뱃지 (항상 표시) */}
      <div className="absolute left-[calc(var(--safe-left)+1rem)] top-[calc(var(--safe-top)+1rem)] z-20 flex items-center gap-2">
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

      {/* 우측: 액션 버튼 (항상 표시 — 기술명 선택은 의도적 행동) */}
      <div className="absolute right-[calc(var(--safe-right)+0.75rem)] bottom-[calc(var(--safe-bottom)+56px+12px)] z-20 flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={() => {
            if (!isAlreadyLabeled && !mutation.isPending)
              setLiked((prev) => !prev);
          }}
          className={cn(
            "flex flex-col items-center gap-1 transition-transform active:scale-90",
            liked ? "text-pink-400" : "text-white",
          )}
        >
          <Heart
            className="h-7 w-7 drop-shadow-lg"
            fill={liked ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
          <span className="text-xs font-medium drop-shadow">좋아요</span>
        </button>

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 transition-transform active:scale-90",
            technique ? "text-indigo-400" : "text-white",
          )}
        >
          <Tag className="h-7 w-7 drop-shadow-lg" strokeWidth={1.5} />
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
          "pointer-events-none absolute bottom-[calc(var(--safe-bottom)+3.5rem)] left-[calc(var(--safe-left)+1rem)] right-[calc(var(--safe-right)+4rem)] z-20 transition-opacity duration-500",
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
          {/* 기술성공 시 부여될 점수 */}
          <div className="inline-flex items-center rounded-full bg-amber-400/90 px-3 py-1 text-xs font-bold text-black backdrop-blur-sm">
            {scoreLabel(score)}
          </div>
        </div>
        <p className="text-xs text-white/60">
          신뢰도 {confidence}% · {clipDuration}초
        </p>
      </div>

      {/* 하단 버튼 바 — 터치 시 등장, 3초 후 자동 숨김 */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 transition-all duration-500",
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

      <TechniqueSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={setTechnique}
        selected={technique}
      />
    </div>
  );
};
