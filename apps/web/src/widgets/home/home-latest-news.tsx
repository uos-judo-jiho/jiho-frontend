import { linkOptions } from "@tanstack/react-router";

import { ContentGrid } from "@/features/content";
import { NewsCard, useLatestNews } from "@/features/news";
import { yearOf } from "@/shared/lib/format";
import { MoreLink } from "@/shared/ui/more-link";
import { SectionHeading } from "@/shared/ui/section-heading";

/** 최신 지호지 — 첫 기사를 크게, 나머지를 그리드로. */
export const HomeLatestNews = () => {
  const { news, latestNewsYear } = useLatestNews();

  if (news.length === 0) return null;

  const [featured, ...rest] = news;

  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="지호지"
        title={`${latestNewsYear}년의 기록`}
        action={
          <MoreLink link={linkOptions({ to: "/news" })}>전체 보기</MoreLink>
        }
      />

      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <NewsCard
          article={featured}
          year={yearOf(featured.dateTime)}
          variant="featured"
        />
        {rest.length > 0 && (
          <ContentGrid columns={2} className="gap-y-8 sm:grid-cols-2">
            {rest.slice(0, 4).map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                year={yearOf(article.dateTime)}
              />
            ))}
          </ContentGrid>
        )}
      </div>
    </section>
  );
};
