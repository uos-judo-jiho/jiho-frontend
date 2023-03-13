import { useEffect, useState } from "react";

var delay = 500;
var timer: any = null;

export function useWindowResize(TargetEl?: HTMLElement) {
  const [elWidth, setElWidth] = useState<number>();

  if (!TargetEl) {
  } else {
    window.addEventListener("resize", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setElWidth(TargetEl.clientWidth);
      }, delay);
    });
  }

  return elWidth;
}
