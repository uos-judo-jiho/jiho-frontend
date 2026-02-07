import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import NewsIndex from "@/components/News/NewsIndex";
import { useNewsQuery } from "@/features/api/news/query";
import { StructuredData, createImageGalleryData } from "@/features/seo";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
import { NewsParamsType } from "@/shared/lib/types/NewsParamsType";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../NotFound";

const NewsYear = () => {
  const { id, index } = useParams<NewsParamsType>();

  const { data: news, isLoading } = useNewsQuery(id);

  // SSG-friendly: 뉴스 데이터가 없어도 기본 메타 정보 제공
  const metaDescription = news
    ? [
        news.year,
        news.articles.at(0)?.title,
        news.articles.at(0)?.description.slice(0, 140),
      ].join(" | ")
    : `${id}년 서울시립대학교 유도부 지호지`;

  const metaImgUrl = news?.articles.at(0)?.imgSrcs.at(0);

  // Create structured data for image gallery
  const structuredData = useMemo(() => {
    if (!news || !news.articles || news.articles.length === 0) {
      return null;
    }

    const currentUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `https://uosjudo.com/news/${id}`;

    // Collect all images from all articles
    const allImages = news.articles.flatMap((article) =>
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
  }, [news, id, metaDescription]);

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
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonItem key={index}>
                  <div className="sm:h-[320px] h-[400px] w-full" />
                </SkeletonItem>
              ))}
            </div>
          ) : (
            <NewsIndex
              articles={news?.articles || []}
              images={news?.images || []}
              selectedIndex={parseInt(index as string)}
              index={index ?? ""}
              year={id}
            />
          )}
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};

export default NewsYear;
