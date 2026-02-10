import { Suspense, useMemo } from "react";

import NewsCard from "@/components/News/NewsCard";
import NewsCardContainer from "@/components/News/NewsCardContainer";
import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";

import { StructuredData, createImageGalleryData } from "@/features/seo";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
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

  const firstYearArticles = allNewsData[0].data?.data?.articles.at(0);
  // SEO meta data
  const metaDescription =
    firstYearArticles !== undefined
      ? [
          firstYearArticles?.title,
          firstYearArticles?.description.slice(0, 140),
        ].join(" | ")
      : "서울시립대학교 유도부 지호지 - 뉴스 및 소식";

  const metaImgUrl = firstYearArticles?.imgSrcs.at(0);

  // Create structured data for image gallery
  const structuredData = useMemo(() => {
    if (!allNewsData || allNewsData.length === 0) return null;

    const currentUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "https://uosjudo.com/news";

    return createImageGalleryData({
      name: "서울시립대학교 유도부 지호지",
      description: metaDescription,
      url: currentUrl,
      images: allNewsData.flatMap((data) => {
        const firstArticle = data.data?.data?.articles.at(0);
        if (!firstArticle) {
          return [];
        }

        return [
          {
            url: firstArticle.imgSrcs[0] || "",
            caption: `${data.data?.data?.year}년 - ${firstArticle.title}`,
            datePublished: firstArticle.dateTime
              ? new Date(firstArticle.dateTime).toISOString()
              : undefined,
          },
        ];
      }),
    });
  }, [allNewsData, metaDescription]);

  return (
    <div>
      <MyHelmet
        title="News"
        description={metaDescription}
        imgUrl={metaImgUrl}
      />
      {structuredData && <StructuredData data={structuredData} />}
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
