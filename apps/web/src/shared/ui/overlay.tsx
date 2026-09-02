import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useBodyScrollLock } from "@/shared/hooks/use-body-scroll-lock";
import { useDismiss } from "@/shared/hooks/use-dismiss";
import { useFocusTrap } from "@/shared/hooks/use-focus-trap";
import { cn } from "@/shared/lib/utils";

type OverlayProps = {
  open: boolean;
  onClose: () => void;
  /** 스크린리더가 읽을 오버레이 이름 */
  label: string;
  children: ReactNode;
  /** 패널이 놓이는 위치 */
  placement?: "center" | "left";
  className?: string;
  panelClassName?: string;
};

/**
 * 모달·드로어 공통 껍데기.
 *
 * 기존 SideBar/DetailImageModal 이 각자 포털·바깥클릭·Esc 를 따로 구현하면서
 * 포커스 트랩과 스크롤 잠금은 둘 다 빠져 있었다. 그 네 가지를 여기 한 곳에 모았다.
 *
 * 닫혀 있을 때는 아예 렌더하지 않는다 — 예전처럼 `hidden` 클래스로만 감추면
 * 안쪽 링크들이 계속 탭 순서에 남아 키보드 사용자가 보이지 않는 메뉴를 통과해야 했다.
 */
export const Overlay = ({
  open,
  onClose,
  label,
  children,
  placement = "center",
  className,
  panelClassName,
}: OverlayProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(open);
  useDismiss(open, panelRef, onClose);
  useFocusTrap(open, panelRef);

  if (typeof document === "undefined" || !open) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex",
        placement === "center"
          ? "items-center justify-center"
          : "items-stretch",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-inverse/80 backdrop-blur-[2px] motion-safe:animate-in motion-safe:fade-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn("relative", panelClassName)}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};
