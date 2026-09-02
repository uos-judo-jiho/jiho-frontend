import { Link } from "@tanstack/react-router";

import { cn } from "@/shared/lib/utils";

import type { Neighbour } from "../model/neighbours";

type ArticleNeighboursProps = {
  /** 더 최신 글. 목록에서 한 칸 위이므로 왼쪽(←)에 놓인다 */
  newer?: Neighbour;
  /** 더 과거 글. 목록에서 한 칸 아래이므로 오른쪽(→)에 놓인다 */
  older?: Neighbour;
  className?: string;
};

/**
 * 상세 하단의 앞뒤 글 이동 줄.
 *
 * 좌우 배치를 여기서만 정한다 — 호출부는 서버가 준 이름(`newer`/`older`)
 * 그대로 넘기고 어느 쪽 화살표인지는 신경 쓰지 않는다. 자세한 배경은
 * `model/neighbours.ts` 참고.
 */
export const ArticleNeighbours = ({
  newer,
  older,
  className,
}: ArticleNeighboursProps) => {
  if (!newer && !older) return null;

  return (
    <nav
      aria-label="글 이동"
      className={cn(
        "flex items-center justify-between gap-4 border-t border-line pt-6",
        className,
      )}
    >
      <NeighbourLink neighbour={newer} direction="prev" />
      <NeighbourLink neighbour={older} direction="next" />
    </nav>
  );
};

const NeighbourLink = ({
  neighbour,
  direction,
}: {
  neighbour: Neighbour | undefined;
  direction: "prev" | "next";
}) => {
  const arrow = direction === "prev" ? "←" : "→";

  // 끝에 도달했을 때는 비활성 링크를 남기지 않고 자리만 유지한다
  if (!neighbour) return <span className="min-w-0 flex-1" aria-hidden />;

  return (
    <Link
      {...neighbour.link}
      className={cn(
        "group flex min-w-0 flex-1 items-center gap-2 text-caption text-ink-muted transition-colors hover:text-ink-strong",
        direction === "next" && "justify-end text-right",
      )}
    >
      {direction === "prev" && (
        <span
          aria-hidden
          className="transition-transform duration-200 ease-brand group-hover:-translate-x-1"
        >
          {arrow}
        </span>
      )}
      <span className="jd-clamp-1">{neighbour.label}</span>
      {direction === "next" && (
        <span
          aria-hidden
          className="transition-transform duration-200 ease-brand group-hover:translate-x-1"
        >
          {arrow}
        </span>
      )}
    </Link>
  );
};
