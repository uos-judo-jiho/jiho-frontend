import { cn } from "@/lib/utils";
import { useCreateLabel } from "@/hooks/use-highlights";
import { useSwipe, type SwipeDirection } from "@/hooks/use-swipe";
import { Check, Heart, Tag } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { VideoHighlight } from "@/api/video";
import { SwipeFeedback, type FeedbackType } from "./swipe-feedback";
import { TechniqueSheet } from "./technique-sheet";

interface Props {
  highlight: VideoHighlight;
  jobId: number;
  index: number;
  total: number;
  onLabeled: () => void;
}

export const ShortsCard = ({ highlight, jobId, index, total, onLabeled }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [liked, setLiked] = useState(false);
  const [technique, setTechnique] = useState<string | null>(
    highlight.currentUserLabel?.technique ?? null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const mutation = useCreateLabel(jobId);

  const saveLabel = useCallback(
    (
      params: { techniqueResult: "NONE" | "SUCCESS"; score: "NONE" | "WAZA_ARI"; isLike?: boolean },
      techniqueOverride?: string | null,
    ) => {
      const body = {
        techniqueResult: params.techniqueResult,
        score: params.score,
        technique: techniqueOverride !== undefined ? techniqueOverride : technique,
        highlightScore: params.isLike ? 8 : liked ? 8 : null,
        correctedEventSec: null,
        memo: null,
      };

      mutation.mutate(
        { highlightId: highlight.id, data: body },
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
      if (mutation.isPending || highlight.isLabeledByCurrentUser) return;

      if (direction === "right") {
        setFeedback("success");
        saveLabel({ techniqueResult: "SUCCESS", score: "WAZA_ARI" });
      } else {
        setFeedback("none");
        saveLabel({ techniqueResult: "NONE", score: "NONE" });
      }
    },
    [highlight.isLabeledByCurrentUser, mutation.isPending, saveLabel],
  );

  const handleDoubleTap = useCallback(() => {
    if (mutation.isPending || highlight.isLabeledByCurrentUser) return;
    setLiked(true);
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

  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipe: handleSwipe,
    onDoubleTap: handleDoubleTap,
    onTap: handleTap,
  });

  const isAlreadyLabeled = highlight.isLabeledByCurrentUser;

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-black">
      <div
        className="relative flex-1"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <video
          ref={videoRef}
          src={highlight.clipUrl}
          autoPlay
          loop
          playsInline
          muted={false}
          preload="auto"
          className="h-full w-full object-contain"
        />

        {isPaused && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/40 p-5 backdrop-blur-sm">
              <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            </div>
          </div>
        )}

        <SwipeFeedback
          feedback={feedback}
          onDone={() => setFeedback(null)}
        />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        <div className="absolute left-4 top-safe-top top-4 flex items-center gap-2">
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

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-center gap-5">
          <button
            type="button"
            onClick={() => {
              if (!isAlreadyLabeled && !mutation.isPending) {
                setLiked((prev) => !prev);
              }
            }}
            className={cn(
              "flex flex-col items-center gap-1 transition-transform active:scale-90",
              liked ? "text-pink-400" : "text-white",
            )}
          >
            <Heart
              className="h-8 w-8 drop-shadow-lg"
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
            <Tag className="h-8 w-8 drop-shadow-lg" strokeWidth={1.5} />
            <span className="text-xs font-medium drop-shadow">
              {technique ? "기술변경" : "기술명"}
            </span>
          </button>
        </div>

        <div className="absolute inset-x-4 bottom-4 pointer-events-none">
          {technique && (
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Tag className="h-3 w-3" />
              {technique}
            </div>
          )}
          <p className="text-xs text-white/60">
            신뢰도 {(highlight.confidence * 100).toFixed(0)}% ·{" "}
            {(highlight.endSec - highlight.startSec).toFixed(1)}초
          </p>
        </div>
      </div>

      {!isAlreadyLabeled && (
        <div className="grid grid-cols-2 border-t border-white/10 bg-black">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => {
              setFeedback("none");
              saveLabel({ techniqueResult: "NONE", score: "NONE" });
            }}
            className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-red-400 transition-colors hover:bg-white/5 active:bg-white/10 disabled:opacity-40"
          >
            <span className="text-xl">👈</span>
            무효
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => {
              setFeedback("success");
              saveLabel({ techniqueResult: "SUCCESS", score: "WAZA_ARI" });
            }}
            className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-green-400 transition-colors hover:bg-white/5 active:bg-white/10 disabled:opacity-40"
          >
            득점
            <span className="text-xl">👉</span>
          </button>
        </div>
      )}

      {isAlreadyLabeled && (
        <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-black py-4 text-sm text-neutral-400">
          <Check className="h-4 w-4 text-green-400" />
          라벨링 완료 · 스와이프해서 다음으로
        </div>
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
