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
 * - 축 잠금을 콘텐츠 좌표에서 직접 계산(수평=라벨 드래그 / 수직=피드 이동)
 * - threshold(10px) + filterTaps: 10px 미만은 탭(더블탭 판정), 이상은 드래그
 * - 가로 모드(CSS 90° 회전) 시 기기 델타를 콘텐츠 좌표로 재매핑
 *
 * 주의: @use-gesture의 axis:'lock'은 회전 전(raw) 좌표로 축을 정하므로
 * transform과 함께 쓰면 가로 모드에서 축이 어긋난다(기기 가로 스와이프가
 * 라벨 드래그로 잘못 잠겨 탐색이 먹통). 그래서 잠금을 직접 처리한다.
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
  // 콜백 재생성을 피하려고 최신 방향을 ref로 유지.
  const orientationRef = useRef(orientation);
  orientationRef.current = orientation;
  const lastTapTime = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 이 제스처에서 잠긴 축(콘텐츠 좌표 기준). 제스처 시작마다 초기화.
  const axisLock = useRef<"none" | "x" | "y">("none");

  // 기기 델타 → 콘텐츠 델타. 가로 모드는 화면이 90°(CW) 회전돼 있어 보정한다.
  // 콘텐츠 x = 기기 y, 콘텐츠 y = -기기 x.
  const toContent = (mx: number, my: number): [number, number] =>
    orientationRef.current === "landscape" ? [my, -mx] : [mx, my];

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
    ({ movement: [mx, my], first, last, tap, xy }) => {
      if (first) axisLock.current = "none";
      // 거의 안 움직였으면(threshold 미만) 탭 — 릴리즈 시점에만 판정.
      if (tap) {
        if (last) handleTap(xy);
        return;
      }

      const [cx, cy] = toContent(mx, my);
      // 우세한 축으로 잠금(콘텐츠 좌표 기준) — 한 번 정해지면 제스처 끝까지 유지.
      if (
        axisLock.current === "none" &&
        (Math.abs(cx) > DRAG_DECISION_DISTANCE ||
          Math.abs(cy) > DRAG_DECISION_DISTANCE)
      ) {
        axisLock.current = Math.abs(cx) >= Math.abs(cy) ? "x" : "y";
      }

      // 손을 뗀 순간: 잠긴 축에서 임계값 넘으면 스와이프, 아니면 원위치 신호.
      if (last) {
        if (axisLock.current === "x") {
          if (Math.abs(cx) > SWIPE_THRESHOLD)
            onSwipe?.(cx > 0 ? "right" : "left");
          else onDragCancel?.();
        } else if (axisLock.current === "y") {
          if (Math.abs(cy) > VERTICAL_SWIPE_THRESHOLD)
            onVerticalSwipe?.(cy > 0 ? "down" : "up");
          else onVerticalDragCancel?.();
        }
        return;
      }

      // 드래그 중: 잠긴 축의 실시간 delta 전달(수평=라벨, 수직=피드 이동).
      if (axisLock.current === "x") onDragMove?.(cx);
      else if (axisLock.current === "y") onVerticalDragMove?.(cy);
    },
    {
      filterTaps: true,
      // 탭 허용 오차와 드래그 시작 임계값을 모두 10px로 맞춘다 — 기존 로직과 동일
      // (10px 미만은 탭, 이상은 드래그). 기본 tapsThreshold(3px)면 3~10px가 사각지대가 됨.
      tapsThreshold: DRAG_DECISION_DISTANCE,
      threshold: DRAG_DECISION_DISTANCE,
    },
  );
};
