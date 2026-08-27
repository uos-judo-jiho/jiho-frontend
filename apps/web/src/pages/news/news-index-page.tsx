import { v2Api } from "@packages/api";
import { linkOptions } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";

import { ArticleCardSkeleton, ContentGrid } from "@/features/content";
import {
  NEWS_PREVIEW_PER_YEAR,
  NewsCard,
  newsYearList,
  useLatestNews,
} from "@/features/news";
import { EmptyState } from "@/shared/ui/empty-state";
import { MoreLink } from "@/shared/ui/more-link";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionHeading } from "@/shared/ui/section-heading";
import { PageShell } from "@/widgets/page-shell";

/** 지호지 전체 아카이브 — 연도별로 최근 몇 편씩 미리 보여준다. */
export const NewsIndexPage = () => {
  const { latestNewsYear } = useLatestNews();
  const years = newsYearList(latestNewsYear).reverse();

  const results = useQueries({
    queries: years.map((year) =>
      v2Api.getGetApiV2NewsYearQueryOptions(Number(year), {
        limit: NEWS_PREVIEW_PER_YEAR,
      }),
    ),
  });

  // 로딩 중인 연도는 걸러내지 않고 스켈레톤으로 자리를 잡아 둔다.
  // (걸러내면 클라이언트 내비게이션 중 섹션이 사라졌다가 튀어나온다)
  const sections = results
    .map((result, index) => ({
      year: years[index],
      articles: result.data?.data.articles ?? [],
      pending: result.isPending,
    }))
    .filter((section) => section.pending || section.articles.length > 0);

  return (
    <PageShell>
      <div className="flex flex-col gap-14">
        <PageHeader
          eyebrow="Archive"
          title="지호지"
          description="부원들이 남긴 활동 기록을 연도별로 모았습니다."
        />

        {sections.length === 0 ? (
          <EmptyState title="아직 발행된 지호지가 없습니다" />
        ) : (
          sections.map(({ year, articles, pending }) => (
            <section key={year} className="flex flex-col gap-6">
              <SectionHeading
                title={`${year}년`}
                action={
                  <MoreLink
                    link={linkOptions({ to: "/news/$id", params: { id: year } })}
                  >
                    {year}년 전체 보기
                  </MoreLink>
                }
              />
              <ContentGrid>
                {pending
                  ? Array.from({ length: NEWS_PREVIEW_PER_YEAR }, (_, i) => (
                      <ArticleCardSkeleton key={i} />
                    ))
                  : articles.map((article) => (
                      <NewsCard key={article.id} article={article} year={year} />
                    ))}
              </ContentGrid>
            </section>
          ))
        )}
      </div>
    </PageShell>
  );
};
