import {
  SCORE_OPTIONS,
  type SuccessScore,
} from "@/features/label-highlight/use-label-highlight";
import { cn } from "@/shared/lib/utils";
import { Ban, Heart, Smartphone, Tag, Volume2, VolumeX } from "lucide-react";
import { createPortal } from "react-dom";

interface Props {
  /** 컨트롤을 렌더할 고정 레이어(세로 피드 transform 밖). 없으면 렌더하지 않음. */
  controlsLayer: HTMLElement | null;
  /** 좋아요 버튼 ref — 더블탭 하트가 날아갈 도착점 계산에 사용. */
  likeButtonRef?: React.Ref<HTMLButtonElement>;
  /** 자동숨김 상태 — 하단 그라데이션 페이드에만 사용(버튼은 항상 노출). */
  showControls: boolean;
  orientationMode: "landscape" | "portrait";
  toggleOrientation: () => void;
  muted: boolean;
  onToggleMute: () => void;
  isAlreadyLabeled: boolean;
  isPending: boolean;
  liked: boolean;
  onToggleLike: () => void;
  technique: string | null;
  onOpenTechniqueSheet: () => void;
  score: SuccessScore;
  onSelectScore: (score: SuccessScore) => void;
  /** 기술x — 기술아님으로 저장하며 위로 스와이프하듯 다음으로 이동. */
  onTechniqueNone: () => void;
  /** 동영상(잡) 제목 — 하단에 최대 2줄로 표시. */
  title: string;
}

/**
 * 쇼츠 카드의 고정 컨트롤 UI(카운터·모드전환·액션버튼·점수선택·기술태그·제목).
 * 세로 피드 transform 밖(#root)으로 포탈해 세로 스크롤에도 고정되도록 한다.
 */
export const ShortsControls = ({
  controlsLayer,
  likeButtonRef,
  showControls,
  orientationMode,
  toggleOrientation,
  muted,
  onToggleMute,
  isAlreadyLabeled,
  isPending,
  liked,
  onToggleLike,
  technique,
  onOpenTechniqueSheet,
  score,
  onSelectScore,
  onTechniqueNone,
  title,
}: Props) => {
  if (!controlsLayer) return null;

  return createPortal(
    <>
      {/* 하단 그라데이션 — 컨트롤 표시 여부와 무관하게 항상 렌더 */}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500",
          showControls ? "opacity-100" : "opacity-0",
        )}
      />

      {/* 상단 */}
      <div className="fixed left-[calc(var(--safe-left)+1rem)] w-[calc(100%-var(--safe-left)-var(--safe-right)-2rem)] top-[calc(var(--safe-top)+1rem)] z-20">
        <div className="w-full flex flex-row justify-between">
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
          {/* 음소거 토글 — 자동재생은 음소거로 시작, 여기서 소리 켜기/끄기 */}
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? "소리 켜기" : "음소거"}
            className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-60 backdrop-blur-sm transition-opacity hover:opacity-100"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            {muted ? "소리" : "음소거"}
          </button>
        </div>
      </div>

      {/* 우측: 액션 버튼 (항상 표시 — 기술명 선택은 의도적 행동) */}
      <div className="fixed right-[calc(var(--safe-right)+0.75rem)] bottom-[calc(var(--safe-bottom)+3rem)] z-20 flex flex-col items-center gap-3">
        {/* 기술없음 — 누르면 '기술아님(NONE)'으로 저장하고 다음으로 넘어간다. */}
        {!isAlreadyLabeled ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (isPending) return;
              // 스탬프 없이, 저장과 최소 0.3초 지연을 함께 기다리며 위로 스와이프한다.
              onTechniqueNone();
            }}
            className="flex flex-col items-center gap-1 text-white transition-transform active:scale-90 disabled:opacity-40 bg-black/20 rounded-xl p-2"
          >
            <Ban className="h-4 w-4 drop-shadow-md" strokeWidth={1.5} />
            <span className="text-xs font-medium drop-shadow">기술 x</span>
          </button>
        ) : null}

        <button
          ref={likeButtonRef}
          type="button"
          onClick={() => {
            if (!isAlreadyLabeled && !isPending) onToggleLike();
          }}
          className={cn(
            "flex flex-col items-center gap-1 transition-transform active:scale-90 disabled:opacity-40 bg-black/20 rounded-xl p-2",
            liked ? "text-red-500" : "text-white",
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
          onClick={onOpenTechniqueSheet}
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
                disabled={isPending}
                onClick={() => onSelectScore(opt.value)}
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

      {/* 하단 좌: 기술명 태그 + 동영상 제목(최대 2줄) — 진행바 바로 위 */}
      <div className="pointer-events-none fixed bottom-[calc(var(--safe-bottom)+0.75rem)] left-[calc(var(--safe-left)+1rem)] right-[calc(var(--safe-right)+4rem)] z-20">
        {technique && (
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Tag className="h-3 w-3" />
            {technique}
          </div>
        )}
        <p className="line-clamp-2 text-sm font-medium leading-snug text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          {title}
        </p>
      </div>
    </>,
    controlsLayer,
  );
};
