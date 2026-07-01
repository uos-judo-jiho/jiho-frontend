import { useCallback, useEffect, useState } from "react";

export type OrientationMode = "landscape" | "portrait";

const ORIENTATION_MODE_KEY = "shorts-orientation-mode";

/**
 * 사용자가 선택한 화면 모드(가로/세로) 선호도.
 * 기본값은 가로. localStorage에 저장되어 재방문 시 유지된다.
 */
export const useOrientationMode = () => {
  const [mode, setMode] = useState<OrientationMode>(() => {
    if (typeof window === "undefined") return "landscape";
    return localStorage.getItem(ORIENTATION_MODE_KEY) === "portrait"
      ? "portrait"
      : "landscape";
  });

  const setOrientationMode = useCallback((next: OrientationMode) => {
    setMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(ORIENTATION_MODE_KEY, next);
    }
  }, []);

  const toggle = useCallback(() => {
    setOrientationMode(mode === "landscape" ? "portrait" : "landscape");
  }, [mode, setOrientationMode]);

  return { mode, setOrientationMode, toggle };
};

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
