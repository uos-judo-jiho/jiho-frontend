import { useEffect, useState } from "react";

export const useIsLandscape = (): boolean => {
  const [isLandscape, setIsLandscape] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(orientation: landscape)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(orientation: landscape)");
    const handler = (e: MediaQueryListEvent) => setIsLandscape(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isLandscape;
};
