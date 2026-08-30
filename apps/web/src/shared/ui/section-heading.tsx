import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** 제목 줄 오른쪽 끝에 붙는 "더보기" 류 링크 */
  action?: ReactNode;
  as?: "h2" | "h3";
  className?: string;
};

/** 한 페이지 안에서 섹션을 나누는 제목. 항상 얇은 괘선을 동반한다. */
export const SectionHeading = ({
  eyebrow,
  title,
  action,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) => (
  <div
    className={cn(
      "flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line pb-3",
      className,
    )}
  >
    <div className="flex flex-col gap-1.5">
      {eyebrow ? <p className="jd-eyebrow">{eyebrow}</p> : null}
      <Tag className="text-heading text-ink-strong">{title}</Tag>
    </div>
    {action ? <div className="pb-1">{action}</div> : null}
  </div>
);
