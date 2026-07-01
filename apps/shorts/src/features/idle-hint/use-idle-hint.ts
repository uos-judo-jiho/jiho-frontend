import { useCallback, useEffect, useRef, useState } from "react";
import { animationFrames } from "rxjs";
import { map } from "rxjs/operators";

// 데모 드래그 곡선 파라미터.
const AMP = 82; // 임계값(60)보다 커서 스탬프가 꽉 찬 상태로 보인다
const HALF = 2400; // 한 방향 주기(ms)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;

// 한 방향(HALF ms) 안에서의 드래그 크기(px). 잠깐 밀었다 멈췄다 놓는 모양.
const halfX = (p: number) => {
  if (p < 0.15 || p >= 0.9) return 0;
  if (p < 0.4) return AMP * easeOut((p - 0.15) / 0.25);
  if (p < 0.7) return AMP;
  return AMP * (1 - easeIn((p - 0.7) / 0.2));
};

// 구독 후 경과 시간(ms) → 가상 드래그 x(px). 오른쪽(+) 먼저, 그다음 왼쪽(-).
const hintDragForElapsed = (elapsed: number) => {
  const el = elapsed % (HALF * 2);
  const p = (el % HALF) / HALF;
  return halfX(p) * (el < HALF ? 1 : -1);
};

// 반복 재생을 몇 회 감지하면 힌트를 켤지(= (N)회 반복 후 (N+1)번째 재생부터).
const LOOP_THRESHOLD = 2;

interface Params {
  /** 현재 클립 id — 바뀌면 힌트 상태를 초기화한다. */
  activeHighlightId: number | undefined;
  /** 이미 라벨된 클립이면 힌트를 띄우지 않는다. */
  isLabeled: boolean;
}

/**
 * 방치 힌트 — 같은 클립을 2회 반복 재생하면(3번째 재생부터) 좌우로 번갈아 끄는
 * 가상 드래그 데모를 보여준다. 데모 애니메이션은 rxjs animationFrames() 스트림으로 구동.
 * 루프 감지는 페이지의 timeupdate에서 notifyTime()으로 주입받는다.
 */
export const useIdleHint = ({ activeHighlightId, isLabeled }: Params) => {
  const [showHint, setShowHint] = useState(false);
  const [hintDragX, setHintDragX] = useState(0);
  const loopCount = useRef(0);
  const lastTime = useRef(0);
  // 콜백 재생성을 피하려고 최신 라벨 여부를 ref로 유지.
  const isLabeledRef = useRef(isLabeled);
  isLabeledRef.current = isLabeled;

  // 클립이 바뀌면 카운터·힌트를 초기화.
  useEffect(() => {
    loopCount.current = 0;
    lastTime.current = 0;
    setShowHint(false);
  }, [activeHighlightId]);

  // 재생 시간 갱신을 받아 loop 재시작(시간이 되감김)을 감지한다.
  const notifyTime = useCallback((currentTime: number) => {
    if (currentTime + 0.1 < lastTime.current) {
      loopCount.current += 1;
      if (loopCount.current >= LOOP_THRESHOLD && !isLabeledRef.current) {
        setShowHint(true);
      }
    }
    lastTime.current = currentTime;
  }, []);

  // 사용자가 조작을 시작하면 힌트를 끄고 카운터를 리셋.
  const reset = useCallback(() => {
    setShowHint(false);
    loopCount.current = 0;
  }, []);

  // 힌트가 켜진 동안 rAF 스트림으로 좌우 번갈이 가상 드래그를 생성.
  useEffect(() => {
    if (!showHint) {
      setHintDragX(0);
      return;
    }
    const sub = animationFrames()
      .pipe(map(({ elapsed }) => hintDragForElapsed(elapsed)))
      .subscribe(setHintDragX);
    return () => {
      sub.unsubscribe();
      setHintDragX(0);
    };
  }, [showHint]);

  return { showHint, hintDragX, notifyTime, reset };
};
