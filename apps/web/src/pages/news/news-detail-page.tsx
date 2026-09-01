import { v2Api } from "@packages/api";
import { Link, getRouteApi, linkOptions } from "@tanstack/react-router";

import { ArticleDetail } from "@/features/content";
import { EmptyState } from "@/shared/ui/empty-state";
import { MoreLink } from "@/shared/ui/more-link";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/news/$id/$newsId");

/**
 * 지호지 상세.
 * 이전에는 NewsDetailPc / NewsDetailMobile 두 벌을 ResponsiveBranch 로 갈랐고
 * 두 쪽이 서로 다른 쿼리(단건 / 연도 전체)를 써서 이전·다음 이동도 PC 에서는
 * 아예 주석 처리돼 있었다. 연도 전체 목록 하나로 통일해 양쪽 모두 동작한다.
 */
export const NewsDetailPage = () => {
  const { id: year, newsId } = routeApi.useParams();

  const { data: news } = v2Api.useListNewsByYearSuspense(
    Number(year),
    undefined,
    { query: { select: (response) => response.data } },
  );

  const articles = news.articles;
  const index = articles.findIndex(
    (article) => String(article.id) === String(newsId),
  );
  const article = index >= 0 ? articles[index] : undefined;

  if (!article) {
    return (
      <PageShell>
        <EmptyState
          title="해당 지호지를 찾을 수 없습니다"
          description="삭제되었거나 주소가 바뀐 글일 수 있습니다."
          action={
            <MoreLink
              link={linkOptions({ to: "/news/$id", params: { id: year } })}
            >
              {year}년 목록으로
            </MoreLink>
          }
        />
      </PageShell>
    );
  }

  const linkTo = (target: (typeof articles)[number]) =>
    linkOptions({
      to: "/news/$id/$newsId",
      params: { id: year, newsId: String(target.id) },
    });

  return (
    <PageShell width="page">
      <div className="flex flex-col gap-10">
        <Link
          {...linkOptions({ to: "/news/$id", params: { id: year } })}
          className="group inline-flex w-fit items-center gap-2 text-caption text-ink-muted transition-colors hover:text-ink-strong"
        >
          <span
            aria-hidden
            className="transition-transform duration-200 ease-brand group-hover:-translate-x-1"
          >
            ←
          </span>
          {year}년 지호지
        </Link>

        <ArticleDetail
          item={article}
          tagsLabel="카테고리"
          position={{ current: index + 1, total: articles.length }}
          prev={
            index > 0
              ? {
                  label: articles[index - 1].title,
                  link: linkTo(articles[index - 1]),
                }
              : null
          }
          next={
            index < articles.length - 1
              ? {
                  label: articles[index + 1].title,
                  link: linkTo(articles[index + 1]),
                }
              : null
          }
        />
      </div>
    </PageShell>
  );
};
