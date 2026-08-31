import { Heart } from "lucide-react";

import { useBoardReactions } from "../api";

import { cn } from "@/shared/lib/utils";

const REACTION_LABELS: Record<string, string> = {
  like: "좋아요",
};

type ReactionStatusProps = {
  /** `board.id` — 지호지·훈련일지·공지가 모두 같은 board 테이블을 쓴다 */
  boardId: number | undefined;
  className?: string;
};

/**
 * 게시글 상세에서 해당 글의 반응 현황을 보여 주는 패널.
 *
 * 백엔드는 지원하는 반응 종류를 반응이 0건이어도 항상 내려주므로
 * (API PR #35 의 요약 응답), 응답 배열을 그대로 렌더링하면 이모지 반응이
 * 추가될 때 이 컴포넌트는 손대지 않아도 된다.
 */
export const ReactionStatus = ({ boardId, className }: ReactionStatusProps) => {
  const { data, isPending, isError } = useBoardReactions(boardId);

  return (
    <section
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-3 rounded-xl border p-4 shadow-sm",
        className,
      )}
    >
      <header className="flex items-center gap-2">
        <Heart className="size-4 text-muted-foreground" aria-hidden />
        <h2 className="text-sm font-semibold">반응 현황</h2>
      </header>

      {isError ? (
        <p className="text-sm text-muted-foreground">
          반응을 불러오지 못했습니다.
        </p>
      ) : isPending ? (
        <p className="text-sm text-muted-foreground">불러오는 중…</p>
      ) : (
        <>
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {data.reactions.map((reaction) => (
              <div key={reaction.type} className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground">
                  {REACTION_LABELS[reaction.type] ?? reaction.type}
                </dt>
                <dd className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold tabular-nums">
                    {reaction.count}
                  </span>
                  {/* 운영자 본인이 누른 반응인지 — 수치를 오해하지 않도록 표시한다 */}
                  {reaction.reacted && (
                    <span className="text-xs text-muted-foreground">
                      (내가 누름)
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-xs text-muted-foreground">
            전체 {data.totalCount}건
          </p>
        </>
      )}
    </section>
  );
};
