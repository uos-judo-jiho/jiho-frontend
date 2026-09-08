import { Link, getRouteApi, linkOptions } from "@tanstack/react-router";

import { ArticleDetail, toNeighbour, useBoardDetail } from "@/features/content";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/news/$id/$newsId");

/**
 * 지호지 상세.
 *
 * 종류를 가리지 않는 단건 엔드포인트 하나로 모였고(api#41), 앞뒤 글도 같은
 * 응답에 담겨 온다. 지호지는 연도별로 목록을 나눠 보므로 앞뒤 탐색 범위도
 * 그 해 안으로 좁힌다(`neighborScope: "year"`).
 * 없는 id·다른 게시판의 id 는 라우트 loader 가 notFound 로 걸러낸다.
 */
export const NewsDetailPage = () => {
  const { id: year, newsId } = routeApi.useParams();

  const article = useBoardDetail(Number(newsId), "year");

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
