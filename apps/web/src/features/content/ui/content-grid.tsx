import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type ContentGridProps = {
  children: ReactNode;
  /** 데스크톱 기준 열 수 */
  columns?: 2 | 3;
  className?: string;
};

/** 카드 목록의 공통 그리드. 열 수만 다르고 간격 규칙은 같다. */
export const ContentGrid = ({
  children,
  columns = 3,
  className,
}: ContentGridProps) => (
  <div
    className={cn(
      "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2",
      columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
      className,
    )}
  >
    {children}
  </div>
);
