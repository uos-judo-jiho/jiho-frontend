import type { VideoHighlight } from "@/entities/video";
import { useLabelHighlight } from "@/features/label-highlight/use-label-highlight";
import { TechniqueSheet } from "@/features/label-highlight/ui/technique-sheet";
import {
  SWIPE_THRESHOLD,
  useSwipe,
  type SwipeDirection,
} from "@/shared/gesture/use-swipe";
import { FlyingHeart } from "@/shared/ui/flying-heart";
import { SwipeDragOverlay, SwipeFeedback } from "@/shared/ui/swipe-feedback";
import { ShortsControls } from "@/widgets/shorts-controls/shorts-controls";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CONTROLS_HIDE_DELAY = 3000;

/** 더블탭으로 스폰된, 좋아요 버튼으로 날아가는 하트 하나. */
interface FlyingHeartItem {
  id: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

interface Props {
  highlight: VideoHighlight;
  /** 동영상(잡) 제목 — 하단에 최대 2줄로 표시. */
  title: string;
  onLabeled: () => void;
  /** 라벨 저장 성공 — 해당 하이라이트를 '완료'로 표시(목록에서 빼지는 않음). */
  onLabelSaved: (highlightId: number) => void;
  /** 위로 스와이프하듯 애니메이션과 함께 다음 클립으로 이동(기술x 버튼용).
      저장 Promise를 받아 최소 지연과 함께 커밋한다. */
  onSwipeUpNext: (savePromise: Promise<unknown>) => void;
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
  /** 방치 데모가 만드는 가상 드래그(px) — 실제 스와이프처럼 스탬프를 구동. */
  hintDragX: number;
  /** 좌우 라벨 드래그 실시간 delta(px) — 페이지가 현재 영상 슬롯을 이동시킨다. */
  onHorizontalDragMove: (deltaX: number) => void;
  /** 사용자가 조작을 시작함(idle 힌트 리셋용). */
  onInteract: () => void;
  /** 화면 회전 모드(가로=CSS 90° 회전) — 스와이프 방향 재매핑에 사용. */
  orientationMode: "landscape" | "portrait";
  /** 가로/세로 모드 전환. */
  toggleOrientation: () => void;
}

export const ShortsCard = ({
  highlight,
  title,
  onLabeled,
  onLabelSaved,
  onSwipeUpNext,
  onVerticalSwipe,
  onVerticalDragMove,
  onVerticalDragCancel,
  controlsLayer,
  videoRef,
  hintDragX,
  onHorizontalDragMove,
  onInteract,
  orientationMode,
  toggleOrientation,
}: Props) => {
  // 라벨링 도메인(기술/점수/좋아요·저장·피드백)은 feature 훅이 담당.
  const label = useLabelHighlight({ highlight, onLabeled, onLabelSaved });

  // ── 카드 프레젠테이션 상태(재생/컨트롤 자동숨김/좌우 드래그) ──
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [dragX, setDragX] = useState(0);

  // 좋아요 버튼 위치(날아가는 하트의 도착점) + 진행 중인 하트들.
  const likeButtonRef = useRef<HTMLButtonElement>(null);
  const [flyingHearts, setFlyingHearts] = useState<FlyingHeartItem[]>([]);
  const flyingIdRef = useRef(0);

  // 더블탭 지점(from) → 좋아요 버튼 중심(to)으로 날아가는 하트를 하나 추가.
  const spawnFlyingHeart = useCallback((from: { x: number; y: number }) => {
    const btn = likeButtonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const to = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    const id = ++flyingIdRef.current;
    setFlyingHearts((prev) => [...prev, { id, from, to }]);
  }, []);

  const removeFlyingHeart = useCallback((id: number) => {
    setFlyingHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

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

  // 카드가 key 없이 유지되므로, 클립이 바뀌면 프레젠테이션 상태를 초기화한다.
  // (라벨 상태 초기화는 useLabelHighlight 내부에서 담당)
  useEffect(() => {
    setIsPaused(false);
    setDragX(0);
    onHorizontalDragMove(0);
    resetControlsTimer();
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- 클립 id 변경 시에만 초기화
  }, [highlight.id]);

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      setDragX(0);
      onHorizontalDragMove(0);
      if (label.isPending) return;
      // 이미 라벨링된 클립은 좌우 어느 쪽으로 스와이프해도 다음으로 넘어간다.
      if (label.isAlreadyLabeled) {
        onLabeled();
        return;
      }
      // 왼쪽=기술성공, 오른쪽=기술시도.
      if (direction === "left") label.saveSuccess();
      else label.saveAttempt();
    },
    [label, onLabeled, onHorizontalDragMove],
  );

  // 드래그 중: 손가락을 따라 영상 이동(페이지가 현재 슬롯을 이동). 라벨링 중엔 잠금.
  const handleDragMove = useCallback(
    (deltaX: number) => {
      if (label.isPending) return;
      setDragX(deltaX);
      onHorizontalDragMove(deltaX);
    },
    [label.isPending, onHorizontalDragMove],
  );

  // 임계값 미달로 손을 떼면 원위치.
  const handleDragCancel = useCallback(() => {
    setDragX(0);
    onHorizontalDragMove(0);
  }, [onHorizontalDragMove]);

  // 더블탭 = 좋아요 토글. 켤 때만 터치 지점에서 좋아요 버튼으로 하트가 날아간다.
  const handleDoubleTap = useCallback(
    (point: { x: number; y: number }) => {
      if (label.isPending || label.isAlreadyLabeled) return;
      const turningOn = !label.liked;
      label.toggleLike();
      if (turningOn) spawnFlyingHeart(point);
    },
    [label, spawnFlyingHeart],
  );

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

  const bindSwipe = useSwipe({
    onSwipe: handleSwipe,
    // 수직 제스처는 페이지의 세로 피드(다음/이전 미리보기)로 위임한다.
    onVerticalSwipe,
    onVerticalDragMove,
    onVerticalDragCancel,
    onDoubleTap: handleDoubleTap,
    onTap: handleTap,
    onDragMove: handleDragMove,
    onDragCancel: handleDragCancel,
    orientation: orientationMode,
  });

  // 조작 시작 시 컨트롤 타이머 리셋 + idle 힌트 끄기. 캡처 단계라 useDrag의
  // onPointerDown(버블)과 충돌하지 않고 먼저 실행된다.
  const handleInteractStart = useCallback(() => {
    onInteract();
    resetControlsTimer();
  }, [onInteract, resetControlsTimer]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* ── 터치 레이어 — 영상은 페이지의 지속(keyed) 슬롯에서 렌더된다.
          touch-none: 드래그 중 브라우저 스크롤/줌 방지(@use-gesture 권장). ── */}
      <div
        className="absolute inset-0 touch-none"
        onPointerDownCapture={handleInteractStart}
        {...bindSwipe()}
      />

      {/* 실시간 스와이프 스탬프 (기술시도/기술성공 · 완료 클립은 다음) */}
      <SwipeDragOverlay
        dragX={dragX + hintDragX}
        threshold={SWIPE_THRESHOLD}
        labeled={label.isAlreadyLabeled}
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

      <SwipeFeedback
        feedback={label.feedback}
        onDone={() => label.setFeedback(null)}
      />

      <ShortsControls
        controlsLayer={controlsLayer}
        likeButtonRef={likeButtonRef}
        showControls={showControls}
        orientationMode={orientationMode}
        toggleOrientation={toggleOrientation}
        isAlreadyLabeled={label.isAlreadyLabeled}
        isPending={label.isPending}
        liked={label.liked}
        onToggleLike={label.toggleLike}
        technique={label.technique}
        onOpenTechniqueSheet={() => label.setSheetOpen(true)}
        score={label.score}
        onSelectScore={label.setScore}
        onTechniqueNone={() => onSwipeUpNext(label.saveNone())}
        title={title}
      />

      {/* 날아가는 하트 — 뷰포트 좌표(터치 xy·버튼 rect)를 쓰므로 어떤 transform도 없는
          document.body에 포탈한다. 가로 모드(shorts-root 90° 회전)에서도 좌표가 맞는다. */}
      {flyingHearts.length > 0 &&
        createPortal(
          flyingHearts.map((h) => (
            <FlyingHeart
              key={h.id}
              from={h.from}
              to={h.to}
              onDone={() => removeFlyingHeart(h.id)}
            />
          )),
          document.body,
        )}

      <TechniqueSheet
        open={label.sheetOpen}
        onClose={() => label.setSheetOpen(false)}
        onSelect={label.setTechnique}
        selected={label.technique}
      />
    </div>
  );
};
