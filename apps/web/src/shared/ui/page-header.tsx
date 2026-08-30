import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type PageHeaderProps = {
  /** 제목 위 작은 라벨 (예: ARCHIVE, 2026) */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** 제목 오른쪽에 놓이는 보조 액션 */
  action?: ReactNode;
  className?: string;
};

/**
 * 목록 페이지 최상단의 제목 블록.
 * 이전에는 `<Title color="black" fontSize="2rem">` 처럼 색과 크기를 호출부가
 * 넘겼는데, 그러다 보니 페이지마다 값이 제각각이었다. 위계는 여기서 고정한다.
 */
export const PageHeader = ({
  eyebrow,
  title,
  description,
  action,
  className,
}: PageHeaderProps) => (
  <header
    className={cn(
      "flex flex-col gap-6 border-b border-line-strong pb-8 sm:flex-row sm:items-end sm:justify-between",
      className,
    )}
  >
    <div className="flex flex-col gap-3">
      {eyebrow ? <p className="jd-eyebrow">{eyebrow}</p> : null}
      <h1 className="text-title text-ink-strong">{title}</h1>
      {description ? (
        <p className="max-w-prose text-lead text-ink-muted">{description}</p>
      ) : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </header>
);
