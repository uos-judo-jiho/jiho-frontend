import { linkOptions } from "@tanstack/react-router";

import { ContentGrid } from "@/features/content";
import { NewsCard, useNewsArchive } from "@/features/news";
import { EmptyState } from "@/shared/ui/empty-state";
import { MoreLink } from "@/shared/ui/more-link";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionHeading } from "@/shared/ui/section-heading";
import { PageShell } from "@/widgets/page-shell";

/**
 * 지호지 전체 아카이브 — 연도별로 최근 몇 편씩 미리 보여준다.
 *
 * 예전에는 연도 수만큼(현재 5회, 매년 +1) 목록을 호출하고 로딩 중인 연도를
 * 스켈레톤으로 메웠다. 이제 한 번의 아카이브 호출로 모든 연도가 함께 오므로
 * 섹션이 따로 도착하는 일이 없다 (api#41).
 */
export const NewsIndexPage = () => {
  const years = useNewsArchive();

  return (
    <PageShell>
      <div className="flex flex-col gap-14">
        <PageHeader
          eyebrow="Archive"
          title="지호지"
          description="부원들이 남긴 활동 기록을 연도별로 모았습니다."
        />

        {years.length === 0 ? (
          <EmptyState title="아직 발행된 지호지가 없습니다" />
        ) : (
          years.map(({ year, total, articles }) => (
            <section key={year} className="flex flex-col gap-6">
              <SectionHeading
                title={`${year}년`}
                action={
                  <MoreLink
                    link={linkOptions({
                      to: "/news/$id",
                      params: { id: String(year) },
                    })}
                  >
                    {year}년 전체 보기 ({total}편)
                  </MoreLink>
                }
              />
              <ContentGrid>
                {articles.map((article) => (
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
