import { useCallback, useRef } from "react";

export type SwipeDirection = "left" | "right";
export type VerticalDirection = "up" | "down";

interface SwipeHandlers {
  onSwipe?: (direction: SwipeDirection) => void;
  /** 위/아래 스와이프 — 라벨 없이 이전/다음 클립으로 이동. */
  onVerticalSwipe?: (direction: VerticalDirection) => void;
  onDoubleTap?: () => void;
  onTap?: () => void;
  /** 손가락이 좌우로 움직이는 동안 실시간 delta(px)를 전달. 오른쪽 +, 왼쪽 -. */
  onDragMove?: (deltaX: number) => void;
  /** 스와이프 임계값을 못 넘기고 손을 뗐을 때 (원위치 복귀 신호). */
  onDragCancel?: () => void;
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
  onDoubleTap,
  onTap,
  onDragMove,
  onDragCancel,
}: SwipeHandlers) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const dragAxis = useRef<DragAxis>("none");
  const lastTapTime = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    dragAxis.current = "none";
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.touches[0].clientX - touchStartX.current;
      const deltaY = e.touches[0].clientY - touchStartY.current;

      // 방향이 아직 안 정해졌다면 우세한 축으로 확정(수평=라벨 드래그, 수직=이동).
      if (
        dragAxis.current === "none" &&
        (Math.abs(deltaX) > DRAG_DECISION_DISTANCE ||
          Math.abs(deltaY) > DRAG_DECISION_DISTANCE)
      ) {
        dragAxis.current =
          Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
      }

      // 카드 실시간 이동은 수평 드래그에서만.
      if (dragAxis.current === "horizontal") {
        onDragMove?.(deltaX);
      }
    },
    [onDragMove],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // 수평 드래그였다면: 임계값 넘으면 스와이프, 아니면 원위치.
      if (dragAxis.current === "horizontal") {
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          onSwipe?.(deltaX > 0 ? "right" : "left");
        } else {
          onDragCancel?.();
        }
        return;
      }

      // 수직 드래그였다면: 임계값 넘으면 라벨 없이 이전/다음 이동.
      if (dragAxis.current === "vertical") {
        if (Math.abs(deltaY) > VERTICAL_SWIPE_THRESHOLD) {
          onVerticalSwipe?.(deltaY > 0 ? "down" : "up");
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
    [onSwipe, onVerticalSwipe, onDoubleTap, onTap, onDragCancel],
  );

  return { onTouchStart, onTouchMove, onTouchEnd };
};
