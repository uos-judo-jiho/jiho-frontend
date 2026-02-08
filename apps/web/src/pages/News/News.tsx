import { Suspense, useMemo } from "react";

import NewsCard from "@/components/News/NewsCard";
import NewsCardContainer from "@/components/News/NewsCardContainer";
import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";

import { StructuredData, createImageGalleryData } from "@/features/seo";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
import { v1Api } from "@packages/api";

const NewsPage = () => {
  const { data } = v1Api.useGetApiV1NewsLatestSuspense(undefined, {
    query: {
      select: (response) => response.data,
    },
  });

  const firstYearArticles = data.articles[0];
  // SEO meta data
  const metaDescription = data.articles.length
    ? [
        firstYearArticles?.title,
        firstYearArticles?.description.slice(0, 140),
      ].join(" | ")
    : "서울시립대학교 유도부 지호지 - 뉴스 및 소식";

  const metaImgUrl = firstYearArticles?.imgSrcs.at(0);

  // Create structured data for image gallery
  const structuredData = useMemo(() => {
    if (!data || data.articles.length === 0) return null;

    const currentUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "https://uosjudo.com/news";

    return createImageGalleryData({
      name: "서울시립대학교 유도부 지호지",
      description: metaDescription,
      url: currentUrl,
      images: data.articles.map((news) => {
        const year = new Date(news.dateTime).getFullYear();
        return {
          url: news.imgSrcs[0] || "",
          caption: `${year}년 - ${news.title}`,
          datePublished: news.dateTime
            ? new Date(news.dateTime).toISOString()
            : undefined,
        };
      }),
    });
  }, [data, metaDescription]);

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
            {data.articles.map((news) => {
              const year = new Date(news.dateTime).getFullYear();
              return (
                <Suspense key={news.id} fallback={<SkeletonThumbnail />}>
                  <div className="flex flex-col gap-4">
                    <a className="hover:underline" href={`/news/${year}`}>
                      <h2 className="text-xl font-semibold px-2 md:px-0">
                        {year}년 지호지 더보기 &gt;
                      </h2>
                    </a>
                    <NewsCardContainer>
                      {data.articles.map((article) => (
                        <NewsCard
                          key={article.id}
                          year={year}
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
