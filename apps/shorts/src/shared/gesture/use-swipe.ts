import { useDrag } from "@use-gesture/react";
import { useRef } from "react";

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
  /** 더블탭 — 두 번째 탭의 뷰포트 좌표를 전달(날아가는 하트 시작점). */
  onDoubleTap?: (point: { x: number; y: number }) => void;
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

/**
 * 쇼츠 카드 제스처 인식 — @use-gesture/react useDrag 기반.
 * - lockDirection: 우세한 축(수평=라벨 드래그 / 수직=피드 이동)으로 잠금
 * - threshold(10px) + filterTaps: 10px 미만은 탭(더블탭 판정), 이상은 드래그
 * - transform: 가로 모드(CSS 90° 회전) 시 기기 델타를 콘텐츠 좌표로 재매핑
 * 반환값 bind()를 대상 요소에 스프레드해서 쓴다.
 */
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
  // 콜백 재생성을 피하려고 최신 방향을 ref로 유지(transform은 매 포인터 이동에서 호출).
  const orientationRef = useRef(orientation);
  orientationRef.current = orientation;
  const lastTapTime = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 탭/더블탭 판정 — 280ms 안에 두 번이면 더블탭, 아니면 지연 후 단일 탭.
  const handleTap = (xy: [number, number]) => {
    const now = Date.now();
    if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
      if (tapTimer.current) clearTimeout(tapTimer.current);
      onDoubleTap?.({ x: xy[0], y: xy[1] });
      lastTapTime.current = 0;
    } else {
      lastTapTime.current = now;
      tapTimer.current = setTimeout(() => onTap?.(), DOUBLE_TAP_DELAY);
    }
  };

  return useDrag(
    ({ movement: [mx, my], last, tap, axis, xy }) => {
      // 거의 안 움직였으면(threshold 미만) 탭 — 릴리즈 시점에만 판정.
      if (tap) {
        if (last) handleTap(xy);
        return;
      }
      // 손을 뗀 순간: 잠긴 축에서 임계값 넘으면 스와이프, 아니면 원위치 신호.
      if (last) {
        if (axis === "x") {
          if (Math.abs(mx) > SWIPE_THRESHOLD)
            onSwipe?.(mx > 0 ? "right" : "left");
          else onDragCancel?.();
        } else if (axis === "y") {
          if (Math.abs(my) > VERTICAL_SWIPE_THRESHOLD)
            onVerticalSwipe?.(my > 0 ? "down" : "up");
          else onVerticalDragCancel?.();
        }
        return;
      }
      // 드래그 중: 잠긴 축의 실시간 delta 전달(수평=라벨, 수직=피드 이동).
      if (axis === "x") onDragMove?.(mx);
      else if (axis === "y") onVerticalDragMove?.(my);
    },
    {
      filterTaps: true,
      // 탭 허용 오차와 드래그 시작 임계값을 모두 10px로 맞춘다 — 기존 로직과 동일
      // (10px 미만은 탭, 이상은 드래그). 기본 tapsThreshold(3px)면 3~10px가 사각지대가 됨.
      tapsThreshold: DRAG_DECISION_DISTANCE,
      threshold: DRAG_DECISION_DISTANCE,
      // v10에서 lockDirection이 axis로 통합됨 — 'lock'이 우세 축으로 잠금.
      axis: "lock",
      transform: ([x, y]) =>
        orientationRef.current === "landscape" ? [y, -x] : [x, y],
    },
  );
};
