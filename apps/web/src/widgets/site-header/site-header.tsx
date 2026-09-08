import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useNewsYears } from "@/features/news";
import { cn } from "@/shared/lib/utils";
import { MenuIcon } from "@/shared/ui/icons";
import { Logo } from "@/shared/ui/logo";
import { buildNavItems } from "@/widgets/site-nav/nav-items";
import { NavDrawer } from "@/widgets/site-nav/nav-drawer";

type SiteHeaderProps = {
  /**
   * solid  — 흰 배경 위에 얹히는 기본 헤더
   * overlay — 홈 히어로 사진 위에 투명하게 얹혔다가, 스크롤하면 solid 로 바뀐다
   */
  variant?: "solid" | "overlay";
};

/**
 * 사이트 헤더.
 *
 * 이전 Navbar 는 1440px 데스크톱에서도 모든 메뉴를 햄버거 뒤에 숨기고 있었다.
 * md 이상에서는 주요 메뉴를 그대로 노출하고, 드로어는 좁은 화면 전용으로 남겼다.
 */
export const SiteHeader = ({ variant = "solid" }: SiteHeaderProps) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const newsYears = useNewsYears();

  const items = buildNavItems(newsYears);

  useEffect(() => {
    if (variant !== "overlay") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // 사진 위에 떠 있는 동안에만 흰 글씨를 쓴다
  const transparent = variant === "overlay" && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 h-header transition-colors duration-300 ease-brand",
          transparent
            ? "bg-transparent"
            : "border-b border-line bg-paper/85 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-full max-w-page items-center justify-between gap-4 px-gutter">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            aria-label="지호 홈으로"
          >
            <Logo
              tone={transparent ? "light" : "dark"}
              className="size-10 transition-opacity"
            />
            <span
              className={cn(
                "text-subheading transition-colors",
                transparent ? "text-on-inverse" : "text-ink-strong",
              )}
            >
              지호
            </span>
          </Link>

          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-1 md:flex"
          >
            {items.map((item) => (
              <Link
                key={item.title}
                {...item.link}
                activeProps={{ "aria-current": "page" }}
                className={cn(
                  "rounded-sm px-3 py-2 text-caption font-semibold transition-colors",
                  transparent
                    ? "text-on-inverse-muted hover:bg-inverse-surface hover:text-on-inverse aria-[current=page]:text-on-inverse"
                    : "text-ink-muted hover:bg-surface-subtle hover:text-ink-strong aria-[current=page]:text-accent-strong",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="메뉴 열기"
            aria-expanded={open}
            className={cn(
              "flex size-10 items-center justify-center rounded-sm transition-colors md:hidden",
              transparent
                ? "text-on-inverse hover:bg-inverse-surface"
                : "text-ink hover:bg-surface-subtle",
            )}
          >
            <MenuIcon className="size-6" decorative />
          </button>
        </div>
      </header>

      <NavDrawer open={open} onClose={() => setOpen(false)} items={items} />
    </>
  );
};
