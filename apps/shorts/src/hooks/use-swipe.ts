import { useCallback, useRef } from "react";

export type SwipeDirection = "left" | "right";
export type VerticalDirection = "up" | "down";

interface SwipeHandlers {
  onSwipe?: (direction: SwipeDirection) => void;
  /** 위/아래 스와이프 확정 — 라벨 없이 이전/다음 클립으로 이동. */
  onVerticalSwipe?: (direction: VerticalDirection) => void;
  /** 손가락이 상하로 움직이는 동안 실시간 delta(px). 아래 +, 위 -. */
  onVerticalDragMove?: (deltaY: number) => void;
  /** 수직 스와이프가 임계값을 못 넘기고 손을 뗐을 때 (원위치 복귀 신호). */
  onVerticalDragCancel?: () => void;
  onDoubleTap?: () => void;
  onTap?: () => void;
  /** 손가락이 좌우로 움직이는 동안 실시간 delta(px)를 전달. 오른쪽 +, 왼쪽 -. */
  onDragMove?: (deltaX: number) => void;
  /** 스와이프 임계값을 못 넘기고 손을 뗐을 때 (원위치 복귀 신호). */
  onDragCancel?: () => void;
  /** 화면이 CSS로 90° 회전(가로 모드)됐을 때 터치 델타를 콘텐츠 좌표로 재매핑. */
  orientation?: "portrait" | "landscape";
}

export const SWIPE_THRESHOLD = 60;
export const VERTICAL_SWIPE_THRESHOLD = 60;
const DOUBLE_TAP_DELAY = 280;
// 이 거리 이상 이동하면 드래그(스와이프)로 간주하고 탭 판정에서 제외한다.
const DRAG_DECISION_DISTANCE = 10;

type DragAxis = "none" | "horizontal" | "vertical";

export const useSwipe = ({
  onSwipe,
  onVerticalSwipe,
  onVerticalDragMove,
  onVerticalDragCancel,
  onDoubleTap,
  onTap,
  onDragMove,
  onDragCancel,
  orientation = "portrait",
}: SwipeHandlers) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const dragAxis = useRef<DragAxis>("none");
  const lastTapTime = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 콜백 재생성을 피하려고 ref로 최신 방향을 유지.
  const orientationRef = useRef(orientation);
  orientationRef.current = orientation;

  // 화면이 90°(CW) 회전됐다면 기기 좌표 델타를 콘텐츠 좌표로 변환.
  // 콘텐츠 x = 기기 y, 콘텐츠 y = -기기 x.
  const toContentDelta = (rawX: number, rawY: number): [number, number] =>
    orientationRef.current === "landscape" ? [rawY, -rawX] : [rawX, rawY];

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    dragAxis.current = "none";
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const [deltaX, deltaY] = toContentDelta(
        e.touches[0].clientX - touchStartX.current,
        e.touches[0].clientY - touchStartY.current,
      );

      // 방향이 아직 안 정해졌다면 우세한 축으로 확정(수평=라벨 드래그, 수직=이동).
      if (
        dragAxis.current === "none" &&
        (Math.abs(deltaX) > DRAG_DECISION_DISTANCE ||
          Math.abs(deltaY) > DRAG_DECISION_DISTANCE)
      ) {
        dragAxis.current =
          Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
      }

      // 카드 실시간 이동은 수평 드래그에서만, 세로 피드 이동은 수직 드래그에서만.
      if (dragAxis.current === "horizontal") {
        onDragMove?.(deltaX);
      } else if (dragAxis.current === "vertical") {
        onVerticalDragMove?.(deltaY);
      }
    },
    [onDragMove, onVerticalDragMove],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const [deltaX, deltaY] = toContentDelta(
        e.changedTouches[0].clientX - touchStartX.current,
        e.changedTouches[0].clientY - touchStartY.current,
      );

      // 수평 드래그였다면: 임계값 넘으면 스와이프, 아니면 원위치.
      if (dragAxis.current === "horizontal") {
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          onSwipe?.(deltaX > 0 ? "right" : "left");
        } else {
          onDragCancel?.();
        }
        return;
      }

      // 수직 드래그였다면: 임계값 넘으면 라벨 없이 이전/다음 이동, 아니면 원위치.
      if (dragAxis.current === "vertical") {
        if (Math.abs(deltaY) > VERTICAL_SWIPE_THRESHOLD) {
          onVerticalSwipe?.(deltaY > 0 ? "down" : "up");
        } else {
          onVerticalDragCancel?.();
        }
        return;
      }

      // 탭/더블탭 판정 (거의 움직이지 않았을 때만).
      if (Math.abs(deltaX) < DRAG_DECISION_DISTANCE && Math.abs(deltaY) < DRAG_DECISION_DISTANCE) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTime.current;

        if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
          if (tapTimer.current) clearTimeout(tapTimer.current);
          onDoubleTap?.();
          lastTapTime.current = 0;
        } else {
          lastTapTime.current = now;
          tapTimer.current = setTimeout(() => {
            onTap?.();
          }, DOUBLE_TAP_DELAY);
        }
      }
    },
    [
      onSwipe,
      onVerticalSwipe,
      onVerticalDragCancel,
      onDoubleTap,
      onTap,
      onDragCancel,
    ],
  );

  return { onTouchStart, onTouchMove, onTouchEnd };
};
