import { useEffect, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { UpperArrowIcon } from "@/shared/ui/icons";

/**
 * 맨 위로 이동 버튼.
 * 이전 StickyButton 은 존재하지 않는 `animate-fadeIn`/`animate-fadeOut`
 * 클래스를 붙이고 있어 실제로는 아무 전환도 일어나지 않았고, 스크롤 핸들러가
 * passive 가 아니었다.
 */
export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      // 숨김 상태에서도 DOM 에 남기되 포커스 대상에서는 뺀다
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed right-4 bottom-4 z-30 flex size-11 items-center justify-center",
        "rounded-full border border-line bg-surface text-ink shadow-md",
        "transition-all duration-300 ease-brand hover:bg-surface-subtle",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <UpperArrowIcon className="size-5" decorative />
    </button>
  );
};
