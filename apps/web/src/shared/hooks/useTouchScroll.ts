import { useState } from "react";

const useTouchScroll = (actions: Function[]) => {
  const [tochedX, setTochedX] = useState<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    setTochedX(e.changedTouches[0].pageX);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const distanceX = tochedX - e.changedTouches[0].pageX;
    if (distanceX < -20) {
      actions[1]();
    } else if (distanceX > 20) {
      actions[0]();
    }
  };
  return { onTouchStart, onTouchEnd };
};

export default useTouchScroll;
