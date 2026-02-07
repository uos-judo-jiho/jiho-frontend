import { Suspense, useMemo } from "react";

import NewsCard from "@/components/News/NewsCard";
import NewsCardContainer from "@/components/News/NewsCardContainer";
import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";

import { useAllNewsQuery } from "@/features/api/news/query";

import { StructuredData, createImageGalleryData } from "@/features/seo";
import MyHelmet from "@/features/seo/helmet/MyHelmet";

const NewsPage = () => {
  const { data: newsList = [] } = useAllNewsQuery();

  const firstYearArticles =
    newsList.length && newsList[0].articles.length
      ? newsList[0]?.articles[0]
      : undefined;

  // SEO meta data
  const metaDescription = newsList.length
    ? [
        firstYearArticles?.title,
        firstYearArticles?.description.slice(0, 140),
      ].join(" | ")
    : "서울시립대학교 유도부 지호지 - 뉴스 및 소식";

  const metaImgUrl = firstYearArticles?.imgSrcs.at(0);

  // Create structured data for image gallery
  const structuredData = useMemo(() => {
    if (!newsList || newsList.length === 0) return null;

    const currentUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "https://uosjudo.com/news";

    return createImageGalleryData({
      name: "서울시립대학교 유도부 지호지",
      description: metaDescription,
      url: currentUrl,
      images: newsList.slice(0, 20).map((news) => ({
        url: news.articles[0]?.imgSrcs[0] || "",
        caption: `${news.year}년 - ${news.articles[0]?.title}`,
        datePublished: news.articles[0]?.dateTime
          ? new Date(news.articles[0].dateTime).toISOString()
          : undefined,
      })),
    });
  }, [newsList, metaDescription]);

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
            {newsList.map((news) => {
              const articles = news.articles.slice(0, 2);

              if (!articles || articles.length === 0) {
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
                      {articles.map((article) => (
                        <NewsCard
                          year={news.year}
                          article={article}
                          key={article.id}
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
