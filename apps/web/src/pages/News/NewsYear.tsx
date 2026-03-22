import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import NewsIndex from "@/components/News/NewsIndex";
import { StructuredData, createImageGalleryData } from "@/features/seo";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
import { NewsParamsType } from "@/shared/lib/types/NewsParamsType";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v2Api } from "@packages/api";
import { Suspense, useMemo } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../NotFound";

const NewsYear = () => {
  const { id, index } = useParams<NewsParamsType>();

  const {
    data: { data: news },
  } = v2Api.useGetApiV2NewsYearSuspense(Number(id));

  // SSG-friendly: 뉴스 데이터가 없어도 기본 메타 정보 제공
  const metaDescription = news
    ? [
        news.year,
        news.articles.at(0)?.title,
        news.articles.at(0)?.description.slice(0, 140),
      ].join(" | ")
    : `${id}년 서울시립대학교 유도부 지호지`;

  const metaImgUrl = news?.articles.at(0)?.images.at(0);

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
      article.images.slice(0, 5).map((imgSrc, imgIdx) => ({
        url: imgSrc,
        caption: `${article.title} - ${imgIdx + 1}`,
        datePublished: article.dateTime
          ? new Date(article.dateTime).toISOString()
          : undefined,
      })),
    );

    return createImageGalleryData({
      name: `${id}년 서울시립대학교 유도부 지호지`,
      description: metaDescription,
      url: currentUrl,
      images: allImages.map((img) => ({
        url: img.url.originSrc,
        caption: img.caption,
        datePublished: img.datePublished,
      })),
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
        imgUrl={metaImgUrl?.originSrc}
      />
      {structuredData && <StructuredData data={structuredData} />}
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
            <NewsIndex
              articles={news?.articles || []}
              selectedIndex={parseInt(index as string)}
              index={index ?? ""}
              year={id}
            />
          </Suspense>
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};

export default NewsYear;
