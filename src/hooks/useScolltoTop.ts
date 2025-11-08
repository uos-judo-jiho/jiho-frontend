import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// TODO: 요구사항에 따라 스크롤 복원 기능으로 변경 고려
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
