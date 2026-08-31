import { Heart } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type ReactionCountProps = {
  /** `useBulkBoardReactions` 가 돌려준 맵에서 꺼낸 요약. 없으면 조회 전이다. */
  summary?: { totalCount: number };
  className?: string;
};

/**
 * 목록 화면의 반응 수 배지.
 *
 * 게시글마다 조회하면 N+1 이 되므로, 목록 쪽에서 `useBulkBoardReactions` 로 한 번에
 * 받아 온 요약을 내려받아 쓴다.
 */
export const ReactionCount = ({ summary, className }: ReactionCountProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 text-sm text-muted-foreground tabular-nums",
      className,
    )}
    title="좋아요 수"
  >
    <Heart className="size-3.5" aria-hidden />
    {summary ? summary.totalCount : "—"}
  </span>
);
