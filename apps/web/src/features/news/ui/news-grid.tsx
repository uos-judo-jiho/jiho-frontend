import { linkOptions } from "@tanstack/react-router";

import { ContentGrid } from "@/features/content";
import type { ContentItem } from "@/shared/lib/types/content";
import { EmptyState } from "@/shared/ui/empty-state";
import { MoreLink } from "@/shared/ui/more-link";
import { NewsCard } from "./news-card";

type NewsGridProps = {
  articles: ContentItem[];
  year: string | number;
  /** 첫 기사를 크게 보여줄지 여부 (연도별 목록에서 사용) */
  featureFirst?: boolean;
};

export const NewsGrid = ({
  articles,
  year,
  featureFirst = false,
}: NewsGridProps) => {
  if (articles.length === 0) {
    return (
      <EmptyState
        title={`${year}년에 발행된 지호지가 없습니다`}
        description="다른 연도의 지호지를 살펴보세요."
        action={
          <MoreLink link={linkOptions({ to: "/news" })}>
            전체 지호지 보기
          </MoreLink>
        }
      />
    );
  }

  const [first, ...rest] = articles;

  if (!featureFirst) {
    return (
      <ContentGrid>
        {articles.map((article, i) => (
          <NewsCard
            key={article.id}
            article={article}
            year={year}
            priority={i < 3}
          />
        ))}
      </ContentGrid>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <NewsCard article={first} year={year} variant="featured" priority />
      {rest.length > 0 && (
        <ContentGrid>
          {rest.map((article, i) => (
            <NewsCard
              key={article.id}
              article={article}
              year={year}
              priority={i < 2}
            />
          ))}
        </ContentGrid>
      )}
    </div>
  );
};
