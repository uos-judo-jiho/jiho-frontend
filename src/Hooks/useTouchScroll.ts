import { useState } from "react";

export function useTouchScroll(action: Function) {
  const [tochedX, setTochedX] = useState<number>(0);
  const [tochedY, setTochedY] = useState<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    setTochedX(e.changedTouches[0].pageX);
    setTochedY(e.changedTouches[0].pageY);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const distanceX = tochedX - e.changedTouches[0].pageX;
    const distanceY = tochedY - e.changedTouches[0].pageY;
    const vector = Math.abs(distanceX / distanceY);
    console.log(distanceY, vector);
    if (distanceY < -20) {
      action();
    }
  };
  return { onTouchStart, onTouchEnd };
}
