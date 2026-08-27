import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";

import { SITE } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { CloseIcon } from "@/shared/ui/icons";
import { Logo } from "@/shared/ui/logo";
import { Overlay } from "@/shared/ui/overlay";
import type { NavItem } from "./nav-items";

type NavDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
};

/**
 * 모바일 내비게이션 드로어.
 *
 * 이전 SideBar 대비 고친 것:
 *  - 포커스 트랩 · Esc · 배경 스크롤 잠금이 없었다 → Overlay 가 전부 처리한다.
 *  - 닫힌 상태에서도 DOM 에 남아 링크가 탭 순서를 차지했다 → 닫히면 언마운트한다.
 *  - `useRef<any>` · 아무것도 하지 않는 `setTimeout` · 빈 else 블록이 있었다.
 *  - 하위 메뉴가 `--item-count` 를 곱한 keyframes 로 열려서 항목 높이가
 *    2rem 이 아니면 어긋났다 → grid-template-rows 전환으로 바꿨다.
 */
export const NavDrawer = ({ open, onClose, items }: NavDrawerProps) => (
  <Overlay
    open={open}
    onClose={onClose}
    label="사이트 메뉴"
    placement="left"
    panelClassName={cn(
      "flex h-full w-[min(22rem,85vw)] flex-col bg-paper shadow-lg",
      "motion-safe:animate-in motion-safe:slide-in-from-left motion-safe:duration-300",
    )}
  >
    <div className="flex items-center justify-between border-b border-line px-5 py-4">
      <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
        <Logo className="size-9" />
        <span className="text-subheading text-ink-strong">지호</span>
      </Link>
      <button
        type="button"
        onClick={onClose}
        aria-label="메뉴 닫기"
        className="flex size-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink-strong"
      >
        <CloseIcon className="size-5" decorative />
      </button>
    </div>

    <nav aria-label="주요 메뉴" className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="flex flex-col">
        {items.map((item) => (
          <DrawerItem key={item.title} item={item} onNavigate={onClose} />
        ))}
      </ul>
    </nav>

    <div className="border-t border-line px-5 py-4">
      <Link
        to="/login"
        onClick={onClose}
        className="text-caption text-ink-subtle transition-colors hover:text-ink"
      >
        로그인
      </Link>
      <p className="mt-2 text-micro text-ink-faint">{SITE.since}</p>
    </div>
  </Overlay>
);

const DrawerItem = ({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const rowClass =
    "flex w-full items-center justify-between rounded-sm px-2 py-3 text-lead font-semibold text-ink transition-colors hover:bg-surface-subtle";

  if (!item.children?.length) {
    return (
      <li>
        <Link
          {...item.link}
          onClick={onNavigate}
          activeProps={{ "aria-current": "page" }}
          className={cn(rowClass, "aria-[current=page]:text-accent-strong")}
        >
          {item.title}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <div className="flex items-center">
        <Link
          {...item.link}
          onClick={onNavigate}
          activeProps={{ "aria-current": "page" }}
          className={cn(rowClass, "aria-[current=page]:text-accent-strong")}
        >
          {item.title}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label={`${item.title} 연도별 목록 ${expanded ? "접기" : "펼치기"}`}
          className="flex size-10 shrink-0 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-surface-subtle"
        >
          <span
            aria-hidden
            className={cn(
              "text-caption transition-transform duration-200 ease-brand",
              expanded && "rotate-45",
            )}
          >
            +
          </span>
        </button>
      </div>

      {/* grid-template-rows 0fr → 1fr 은 내용 높이를 몰라도 부드럽게 열린다 */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-brand",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <ul className="overflow-hidden">
          {item.children.map((child) => {
            const isCurrent =
              location.pathname === (child.link.to as string) ||
              location.pathname ===
                `/news/${(child.link.params as { id?: string })?.id ?? ""}`;

            return (
              <li key={child.title}>
                <Link
                  {...child.link}
                  onClick={onNavigate}
                  className={cn(
                    "block rounded-sm py-2 pr-2 pl-5 text-caption transition-colors hover:bg-surface-subtle",
                    isCurrent
                      ? "font-semibold text-accent-strong"
                      : "text-ink-muted",
                  )}
                >
                  {child.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
};
