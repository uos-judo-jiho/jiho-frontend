import { useState, useRef, useCallback } from "react";

interface SwipeNavigationOptions {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // 최소 스와이프 거리 (px)
  velocity?: number; // 최소 스와이프 속도 (px/ms)
}

export const useSwipeNavigation = ({
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocity = 0.3,
}: SwipeNavigationOptions) => {
  const [touchStart, setTouchStart] = useState<{
    y: number;
    time: number;
  } | null>(null);
  const scrollYRef = useRef<number>(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    // 현재 스크롤 위치 저장
    scrollYRef.current = window.scrollY;

    setTouchStart({
      y: e.touches[0].clientY,
      time: Date.now(),
    });
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return;

      const touchEnd = {
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const distanceY = touchStart.y - touchEnd.y;
      const duration = touchEnd.time - touchStart.time;
      const swipeVelocity = Math.abs(distanceY) / duration;

      // 스크롤 위치가 변경되지 않았는지 확인 (실제 스와이프인지 판단)
      const scrollChanged = Math.abs(window.scrollY - scrollYRef.current) > 10;

      // 빠른 스와이프이고, 스크롤이 발생하지 않았을 때만 페이지 전환
      if (!scrollChanged && swipeVelocity >= velocity) {
        // 위로 스와이프 (다음 페이지)
        if (distanceY > threshold && onSwipeUp) {
          onSwipeUp();
        }
        // 아래로 스와이프 (이전 페이지)
        else if (distanceY < -threshold && onSwipeDown) {
          onSwipeDown();
        }
      }

      setTouchStart(null);
    },
    [touchStart, threshold, velocity, onSwipeUp, onSwipeDown]
  );

  return { onTouchStart, onTouchEnd };
};
