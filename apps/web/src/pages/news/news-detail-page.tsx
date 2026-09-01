import { v2Api } from "@packages/api";
import { Link, getRouteApi, linkOptions } from "@tanstack/react-router";

import { ArticleDetail } from "@/features/content";
import { toNeighbour } from "@/features/content/model/neighbours";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/news/$id/$newsId");

/**
 * 지호지 상세.
 *
 * 이전에는 연도 전체 목록을 받아 그 안에서 현재 글과 앞뒤를 찾았다. 이제 서버가
 * 단건 응답에 prev/next 를 함께 준다 (api#38) — 그 해 기사를 전부 내려받던 것이
 * 1건으로 줄었다. 앞뒤 글은 서버도 같은 연도 안에서 찾으므로 동작은 그대로다.
 * 없는 id 는 라우트 loader 가 notFound 로 걸러낸다.
 */
export const NewsDetailPage = () => {
  const { id: year, newsId } = routeApi.useParams();

  const { data: article } = v2Api.useGetNewsArticleSuspense(
    Number(year),
    Number(newsId),
    { query: { select: (response) => response.data.article } },
  );

  const linkTo = (id: number) =>
    linkOptions({
      to: "/news/$id/$newsId",
      params: { id: year, newsId: String(id) },
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
          newer={toNeighbour(article.next, linkTo, "다음 기사")}
          older={toNeighbour(article.prev, linkTo, "이전 기사")}
        />
      </div>
    </PageShell>
  );
};
