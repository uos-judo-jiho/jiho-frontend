import { Suspense } from "react";

import NewsCard from "@/components/News/NewsCard";
import NewsCardContainer from "@/components/News/NewsCardContainer";
import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";

import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v2Api } from "@packages/api";
import { useQueries } from "@tanstack/react-query";

const NewsPage = () => {
  const allNewsData = useQueries({
    queries: vaildNewsYearList()
      .reverse()
      .map((year) =>
        v2Api.getGetApiV2NewsYearQueryOptions(Number(year), { limit: 2 }),
      ),
  });

  return (
    <div>
      <DefaultLayout>
        <SheetWrapper>
          <Title title="지호지" color="black" />

          <div className="flex flex-col gap-6">
            {allNewsData.map((data) => {
              const news = data.data?.data;

              if (!news || news.articles.length === 0) {
                return null;
              }

              return (
                <Suspense key={news.year} fallback={<SkeletonThumbnail />}>
                  <div className="flex flex-col gap-4">
                    <a className="hover:underline" href={`/news/${news.year}`}>
                      <h2 className="text-xl font-semibold px-2 md:px-0">
                        {news.year}년 지호지 더보기 &gt;
                      </h2>
                    </a>
                    <NewsCardContainer>
                      {news.articles.map((article) => (
                        <NewsCard
                          key={article.id}
                          year={news.year}
                          article={article}
                        />
                      ))}
                    </NewsCardContainer>
                  </div>
                </Suspense>
              );
            })}
          </div>
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};

export default NewsPage;
