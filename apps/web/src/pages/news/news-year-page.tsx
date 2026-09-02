import { v2Api } from "@packages/api";
import { getRouteApi, linkOptions } from "@tanstack/react-router";

import { NewsGrid, isValidNewsYear, useLatestNews } from "@/features/news";
import { MoreLink } from "@/shared/ui/more-link";
import { PageHeader } from "@/shared/ui/page-header";
import { PageShell } from "@/widgets/page-shell";
import { NotFoundPage } from "@/pages/not-found-page";

const routeApi = getRouteApi("/news/$id/");

/** 특정 연도의 지호지 목록. */
export const NewsYearPage = () => {
  const { id } = routeApi.useParams();
  const { latestNewsYear } = useLatestNews();

  const { data: news } = v2Api.useListNewsByYearSuspense(
    Number(id),
    undefined,
    {
      query: { select: (response) => response.data },
    },
  );

  if (!isValidNewsYear(id, latestNewsYear)) {
    return <NotFoundPage />;
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow="지호지"
          title={`${id}년`}
          description={`${id}년에 발행된 지호지 ${news.articles.length}편`}
          action={
            <MoreLink link={linkOptions({ to: "/news" })} tone="inverse">
              연도 전체 보기
            </MoreLink>
          }
        />
        <NewsGrid articles={news.articles} year={id} featureFirst />
      </div>
    </PageShell>
  );
};
