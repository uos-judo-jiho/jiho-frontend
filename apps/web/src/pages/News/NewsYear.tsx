import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import NewsIndex from "@/components/News/NewsIndex";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v2Api } from "@packages/api";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import NotFound from "../NotFound";

const routeApi = getRouteApi("/news/$id/");

const NewsYear = () => {
  const { id } = routeApi.useParams();

  const {
    data: { data: news },
  } = v2Api.useGetApiV2NewsYearSuspense(Number(id));

  if (!id || !vaildNewsYearList().includes(id)) {
    return <NotFound />;
  }

  return (
    <div>
      <DefaultLayout>
        <SheetWrapper>
          <Title title={`${id}년 지호지`} color="black" />
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonItem key={index}>
                    <div className="sm:h-[320px] h-[400px] w-full" />
                  </SkeletonItem>
                ))}
              </div>
            }
          >
            <NewsIndex articles={news?.articles || []} year={id} />
          </Suspense>
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};

export default NewsYear;
