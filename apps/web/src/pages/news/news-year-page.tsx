import { getRouteApi, linkOptions } from "@tanstack/react-router";

import { LoadMoreButton, useBoardList } from "@/features/content";
import { NewsGrid } from "@/features/news";
import { MoreLink } from "@/shared/ui/more-link";
import { PageHeader } from "@/shared/ui/page-header";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/news/$id/");

/** 특정 연도의 지호지 목록. 없는 연도는 라우트 loader 가 notFound 로 걸러낸다. */
export const NewsYearPage = () => {
  const { id } = routeApi.useParams();

  const { items, total, hasMore, isLoadingMore, loadMore } = useBoardList({
    type: "news",
    year: Number(id),
  });

  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow="지호지"
          title={`${id}년`}
          description={`${id}년에 발행된 지호지 ${total}편`}
          action={
            <MoreLink link={linkOptions({ to: "/news" })} tone="inverse">
              연도 전체 보기
            </MoreLink>
          }
        />
        <NewsGrid articles={items} year={id} featureFirst />
        {hasMore && (
          <LoadMoreButton onClick={loadMore} loading={isLoadingMore}>
            지호지 더 보기
          </LoadMoreButton>
        )}
      </div>
    </PageShell>
  );
};
