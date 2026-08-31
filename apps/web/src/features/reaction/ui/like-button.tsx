import { useState } from "react";

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
 * 로그인 안내 모달을 띄운다 (`useBoardReaction`). 웹에는 인증 상태 저장소가 없어
 * 미리 숨기거나 비활성화할 방법이 없고, 숨기면 좋아요 수까지 사라진다.
 */
export const LikeButton = ({ boardId, className }: LikeButtonProps) => {
  const { count, reacted, isLoading, isMutating, toggle } =
    useBoardReaction(boardId);

  /**
   * 누를 때마다 1씩 오르는 값. 애니메이션이 붙은 요소의 key 로 써서 같은 동작을
   * 연달아 해도 다시 재생되게 한다 (클래스만 토글하면 두 번째부터 재생되지 않는다).
   */
  const [pressCount, setPressCount] = useState(0);

  // 하트가 채워지는 순간에만 터뜨린다 — 취소할 때는 조용히 비운다
  const bursting = pressCount > 0 && reacted;

  const handleClick = () => {
    setPressCount((previous) => previous + 1);
    toggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
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
      <span className="relative inline-flex">
        {/*
          하트에서 퍼져 나가는 링. 버튼 바깥으로 번져야 해서 레이아웃에서 빼고
          (absolute) 포인터 이벤트도 받지 않는다.
        */}
        {bursting ? (
          <span
            key={`burst-${pressCount}`}
            aria-hidden
            className="animate-heart-burst pointer-events-none absolute inset-0 rounded-full border border-danger"
          />
        ) : null}

        <span
          key={`heart-${pressCount}`}
          className={cn("inline-flex", bursting && "animate-heart-pop")}
        >
          <HeartIcon
            decorative
            filled={reacted}
            size={18}
            className="transition-transform duration-200 ease-brand group-active:scale-90"
          />
        </span>
      </span>

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
