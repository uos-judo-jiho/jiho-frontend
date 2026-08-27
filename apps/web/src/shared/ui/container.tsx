import type { ElementType, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type ContainerProps = {
  children: ReactNode;
  /** prose: 긴 글 가독 폭 / page: 기본 본문 폭 / full: 폭 제한 없이 좌우 여백만 */
  width?: "prose" | "page" | "full";
  as?: ElementType;
  className?: string;
};

const WIDTH = {
  prose: "max-w-prose",
  page: "max-w-page",
  full: "max-w-none",
} as const;

/** 페이지 본문 폭과 좌우 거터를 한 곳에서 관리한다. */
export const Container = ({
  children,
  width = "page",
  as: Tag = "div",
  className,
}: ContainerProps) => (
  <Tag className={cn("mx-auto w-full px-gutter", WIDTH[width], className)}>
    {children}
  </Tag>
);
