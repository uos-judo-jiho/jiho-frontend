import { useState } from "react";

const useTouchScroll = (actions: Function[]) => {
  const [tochedX, setTochedX] = useState<number>(0);
  const [tochedY, setTochedY] = useState<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    setTochedX(e.changedTouches[0].pageX);
    setTochedY(e.changedTouches[0].pageY);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const distanceX = tochedX - e.changedTouches[0].pageX;
    const distanceY = tochedY - e.changedTouches[0].pageY;
    // TODO:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const vector = Math.abs(distanceX / distanceY);

    if (distanceX < -20) {
      actions[1]();
    } else if (distanceX > 20) {
      actions[0]();
    }
  };
  return { onTouchStart, onTouchEnd };
};

export default useTouchScroll;
