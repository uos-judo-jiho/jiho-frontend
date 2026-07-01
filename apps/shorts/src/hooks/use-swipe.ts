import { useCallback, useRef } from "react";

export type SwipeDirection = "left" | "right";

interface SwipeHandlers {
  onSwipe?: (direction: SwipeDirection) => void;
  onDoubleTap?: () => void;
  onTap?: () => void;
}

const SWIPE_THRESHOLD = 60;
const DOUBLE_TAP_DELAY = 280;

export const useSwipe = ({ onSwipe, onDoubleTap, onTap }: SwipeHandlers) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lastTapTime = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      if (
        Math.abs(deltaX) > SWIPE_THRESHOLD &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.5
      ) {
        onSwipe?.(deltaX > 0 ? "right" : "left");
        return;
      }

      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
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
    [onSwipe, onDoubleTap, onTap],
  );

  return { onTouchStart, onTouchEnd };
};
