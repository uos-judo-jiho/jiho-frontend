import { LikeButton } from "@/features/reaction";

import type { ContentItem } from "@/shared/lib/types/content";
import { formatDate } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { Markdown } from "@/shared/ui/markdown";
import { MediaCarousel } from "@/shared/ui/media-carousel";
import { Tag } from "@/shared/ui/tag";

import type { Neighbour } from "../model/neighbours";
import { ArticleNeighbours } from "./article-neighbours";

type ArticleDetailProps = {
  item: ContentItem;
  /** 태그 줄에 붙는 라벨 (지호지는 "카테고리", 훈련일지는 "참여 인원") */
  tagsLabel?: string;
  /**
   * 앞뒤 글 이동. 서버가 주는 이름 그대로 넘긴다 (`next` 가 더 최신, `prev` 가
   * 더 과거) — 좌우 배치는 ArticleNeighbours 가 정한다.
   */
  newer?: Neighbour;
  older?: Neighbour;
  className?: string;
};

/**
 * 지호지 기사·훈련일지 상세 본문.
 *
 * 이전에는 같은 화면을 NewsDetailPc/NewsDetailMobile/PhotoDetailPc/
 * PhotoDetailMobile 네 벌로 각각 그리고 있었고, 그중 둘은 JS 로 뷰포트를
 * 재서 분기했다. 레이아웃 차이는 전부 CSS 로 표현 가능한 수준이었으므로
 * 한 컴포넌트로 합쳤다.
 */
export const ArticleDetail = ({
  item,
  tagsLabel = "카테고리",
  newer,
  older,
  className,
}: ArticleDetailProps) => (
  <article className={cn("flex flex-col gap-4", className)}>
    <header className="flex flex-col gap-5 border-b border-line-strong pb-4">
      <h1 className="text-title text-ink-strong">{item.title}</h1>

      <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption">
        <div className="flex flex-col items-start gap-2">
          <dt className="text-ink-faint">작성자</dt>
          <dd className="font-medium text-ink">{item.author}</dd>
        </div>
        {item.dateTime && (
          <div className="flex flex-col items-start gap-2">
            <dt className="text-ink-faint">작성일</dt>
            <dd className="font-medium text-ink">
              <time dateTime={item.dateTime}>{formatDate(item.dateTime)}</time>
            </dd>
          </div>
        )}
        {item.tags.length > 0 && (
          <div className="flex flex-col items-start gap-2">
            <dt className="text-ink-faint">{tagsLabel}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>#{tag}</Tag>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </header>

    {item.images.length > 0 && (
      <MediaCarousel items={item.images} label={item.title} />
    )}

    <div>
      <Markdown content={item.description} />
    </div>

    {/* 본문을 다 읽은 자리에 둔다 — 게시글의 board.id 가 곧 반응의 대상이다 */}
    <div className="flex justify-center pt-2">
      <LikeButton boardId={Number(item.id)} />
    </div>

    <ArticleNeighbours newer={newer} older={older} />

  </article>
);
