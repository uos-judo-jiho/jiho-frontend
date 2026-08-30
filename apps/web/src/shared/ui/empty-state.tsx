import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** 목록이 비었을 때 쓰는 공통 안내. */
export const EmptyState = ({
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center gap-3 rounded-md border border-dashed border-line px-6 py-20 text-center",
      className,
    )}
  >
    <p className="text-subheading text-ink">{title}</p>
    {description ? (
      <p className="max-w-prose text-caption text-ink-muted">{description}</p>
    ) : null}
    {action ? <div className="mt-2">{action}</div> : null}
  </div>
);
