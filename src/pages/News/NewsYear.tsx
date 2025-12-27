import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import NewsIndex from "@/components/News/NewsIndex";
import { StructuredData, createImageGalleryData } from "@/features/seo";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
import { useNews } from "@/recoils/news";
import { NewsParamsType } from "@/shared/lib/types/NewsParamsType";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../NotFound";

const NewsYear = () => {
  const { id, index } = useParams<NewsParamsType>();
  const { news, fetch } = useNews(id); // year 파라미터 전달

  useEffect(() => {
    if (news.some((newsData) => newsData.year?.toString() === id?.toString())) {
      return;
    }
    if (!id) {
      return;
    }
    fetch(id);
  }, [fetch, id, news]);

  const currentPageNews = news.find(
    (newsData) => newsData.year?.toString() === id?.toString()
  );

  // SSG-friendly: 뉴스 데이터가 없어도 기본 메타 정보 제공
  const metaDescription = currentPageNews
    ? [
        currentPageNews.year,
        currentPageNews.articles.at(0)?.title,
        currentPageNews.articles.at(0)?.description.slice(0, 140),
      ].join(" | ")
    : `${id}년 서울시립대학교 유도부 지호지`;

  const metaImgUrl = currentPageNews?.articles.at(0)?.imgSrcs.at(0);

  // Create structured data for image gallery
  const structuredData = useMemo(() => {
    if (
      !currentPageNews ||
      !currentPageNews.articles ||
      currentPageNews.articles.length === 0
    ) {
      return null;
    }

    const currentUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `https://uosjudo.com/news/${id}`;

    // Collect all images from all articles
    const allImages = currentPageNews.articles.flatMap((article) =>
      article.imgSrcs.slice(0, 5).map((imgSrc, imgIdx) => ({
        url: imgSrc,
        caption: `${article.title} - ${imgIdx + 1}`,
        datePublished: article.dateTime
          ? new Date(article.dateTime).toISOString()
          : undefined,
      }))
    );

    return createImageGalleryData({
      name: `${id}년 서울시립대학교 유도부 지호지`,
      description: metaDescription,
      url: currentUrl,
      images: allImages.slice(0, 30), // Limit to 30 images for performance
    });
  }, [currentPageNews, id, metaDescription]);

  if (!id || !vaildNewsYearList().includes(id)) {
    return <NotFound />;
  }

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
          <Title title={`${id}년 지호지`} color="black" />
          <NewsIndex
            articles={currentPageNews?.articles || []}
            images={currentPageNews?.images || []}
            selectedIndex={parseInt(index as string)}
            index={index ?? ""}
            year={id}
          />
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};

export default NewsYear;
