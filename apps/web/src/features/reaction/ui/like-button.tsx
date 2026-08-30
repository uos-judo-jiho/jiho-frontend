import { useBoardReaction } from "../model/use-board-reaction";

import { cn } from "@/shared/lib/utils";
import { HeartIcon } from "@/shared/ui/icons";

type LikeButtonProps = {
  /** `board.id` — 지호지·훈련일지·공지가 모두 같은 board 테이블을 쓴다 */
  boardId: number;
  className?: string;
};

/**
 * 게시글 좋아요 버튼.
 *
 * 로그인하지 않은 사용자에게도 그대로 보여 주고, 누르는 순간 401 을 받으면
 * 로그인 화면으로 보낸다 (`useBoardReaction`). 웹에는 인증 상태 저장소가 없어
 * 미리 숨기거나 비활성화할 방법이 없고, 숨기면 좋아요 수까지 사라진다.
 */
export const LikeButton = ({ boardId, className }: LikeButtonProps) => {
  const { count, reacted, isLoading, isMutating, toggle } =
    useBoardReaction(boardId);

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isMutating}
      aria-pressed={reacted}
      aria-label={reacted ? "좋아요 취소" : "좋아요"}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-caption transition-colors duration-200 ease-brand",
        "disabled:pointer-events-none disabled:opacity-60",
        reacted
          ? "border-danger/30 bg-danger-soft text-danger"
          : "border-line text-ink-muted hover:border-line-strong hover:text-ink-strong",
        className,
      )}
    >
      <HeartIcon
        decorative
        filled={reacted}
        size={18}
        className="transition-transform duration-200 ease-brand group-active:scale-90"
      />
      <span data-numeric className="font-medium tabular-nums">
        {/*
          첫 조회 전에는 자리만 잡아 둔다. 숫자를 0 으로 보여 주면 응답이 도착할 때
          값이 튀어 보인다.
        */}
        {isLoading ? "—" : count}
      </span>
    </button>
  );
};
