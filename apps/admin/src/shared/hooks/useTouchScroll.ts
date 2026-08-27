import { useState } from "react";

const useTouchScroll = (actions: Function[]) => {
  const [tochedX, setTochedX] = useState<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    setTochedX(e.changedTouches[0].pageX);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const distanceX = tochedX - e.changedTouches[0].pageX;
    // TODO: 세로 이동량도 함께 재서 기울기로 가로/세로 스와이프를 구분하기
    // (지금은 가로 거리만 보므로 대각선 스와이프도 좌우로 처리된다)

    if (distanceX < -20) {
      actions[1]();
    } else if (distanceX > 20) {
      actions[0]();
    }
  };
  return { onTouchStart, onTouchEnd };
};

export default useTouchScroll;
