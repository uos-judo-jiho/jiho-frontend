import { useCallback, useRef } from "react";

export type SwipeDirection = "left" | "right";

interface SwipeHandlers {
  onSwipe?: (direction: SwipeDirection) => void;
  onDoubleTap?: () => void;
  onTap?: () => void;
  /** 손가락이 좌우로 움직이는 동안 실시간 delta(px)를 전달. 오른쪽 +, 왼쪽 -. */
  onDragMove?: (deltaX: number) => void;
  /** 스와이프 임계값을 못 넘기고 손을 뗐을 때 (원위치 복귀 신호). */
  onDragCancel?: () => void;
}

export const SWIPE_THRESHOLD = 60;
const DOUBLE_TAP_DELAY = 280;
// 이 거리 이상 수평 이동하면 드래그(스와이프)로 간주하고 탭 판정에서 제외한다.
const DRAG_DECISION_DISTANCE = 10;

export const useSwipe = ({
  onSwipe,
  onDoubleTap,
  onTap,
  onDragMove,
  onDragCancel,
}: SwipeHandlers) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalDrag = useRef(false);
  const lastTapTime = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalDrag.current = false;
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.touches[0].clientX - touchStartX.current;
      const deltaY = e.touches[0].clientY - touchStartY.current;

      // 아직 방향이 정해지지 않았다면, 수평 우세일 때만 드래그로 확정.
      if (
        !isHorizontalDrag.current &&
        Math.abs(deltaX) > DRAG_DECISION_DISTANCE &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        isHorizontalDrag.current = true;
      }

      if (isHorizontalDrag.current) {
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
      if (isHorizontalDrag.current) {
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          onSwipe?.(deltaX > 0 ? "right" : "left");
        } else {
          onDragCancel?.();
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
    [onSwipe, onDoubleTap, onTap, onDragCancel],
  );

  return { onTouchStart, onTouchMove, onTouchEnd };
};
