import { Link, type LinkOptions } from "@tanstack/react-router";

import { cn } from "@/shared/lib/utils";

type MoreLinkProps = {
  /** linkOptions() 로 만들어 라우트가 컴파일 타임에 검증된 링크 */
  link: LinkOptions;
  children: React.ReactNode;
  tone?: "default" | "inverse";
  className?: string;
};

/**
 * "더보기 →" 링크. 호버 시 화살표가 밀려나며 방향성을 준다.
 */
export const MoreLink = ({
  link,
  children,
  tone = "default",
  className,
}: MoreLinkProps) => (
  <Link
    {...link}
    className={cn(
      "group inline-flex items-center gap-1.5 text-caption font-semibold transition-colors",
      tone === "default"
        ? "text-ink-muted hover:text-ink-strong"
        : "text-on-inverse-muted hover:text-on-inverse",
      className,
    )}
  >
    {children}
    <span
      aria-hidden
      className="transition-transform duration-200 ease-brand group-hover:translate-x-1"
    >
      →
    </span>
  </Link>
);
