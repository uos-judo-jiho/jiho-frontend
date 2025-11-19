import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import Footer from "@/components/common/Footer/footer";
import MobileHeader from "@/components/common/MobileHeader/MobileHeader";
import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import Loading from "@/components/common/Skeletons/Loading";
import Slider from "@/components/layouts/Slider";
import { Button } from "@/components/ui/button";

import { StructuredData, createArticleData } from "@/seo";
import MyHelmet from "@/seo/helmet/MyHelmet";

import { cn } from "@/lib/utils";

import { NewsDetailPageProps } from "./types/NewsDetailPageProps";

export const NewsDetailMobile = ({
  news,
  year,
  newsId,
}: NewsDetailPageProps) => {
  const articles = news.articles;
  const currentIndex = articles.findIndex(
    (article) => article.id.toString() === newsId
  );

  const currentArticle = articles[currentIndex];

  // Prepare metadata (before early return to satisfy React Hook rules)
  const metaDescription = currentArticle
    ? [currentArticle.title, currentArticle.description.slice(0, 140)].join(
        " | "
      )
    : "";

  const metaImgUrl = currentArticle?.imgSrcs.at(0);

  // Format date for meta tags (ISO 8601 format)
  const publishedDate = currentArticle?.dateTime
    ? new Date(currentArticle.dateTime).toISOString()
    : undefined;

  // Create structured data for article (must be before early return)
  const structuredData = useMemo(() => {
    if (!currentArticle) return null;

    return createArticleData({
      headline: `${year}년 지호지 - ${currentArticle.title}`,
      description: metaDescription,
      images: currentArticle.imgSrcs,
      datePublished: publishedDate,
      dateModified: publishedDate,
      author: currentArticle.author,
    });
  }, [year, currentArticle, metaDescription, publishedDate]);

  if (!currentArticle) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MyHelmet
        title={`${year}년 지호지 - ${currentArticle.title}`}
        description={metaDescription}
        imgUrl={metaImgUrl}
        datePublished={publishedDate}
        dateModified={publishedDate}
        author={currentArticle.author}
        articleType="article"
      />
      {structuredData && <StructuredData data={structuredData} />}

      <MobileHeader
        backUrl={`/news/${year}`}
        subTitle={`${year} 지호지`}
        subTitleUrl={`/news/${year}`}
      />

      <div className="flex-1">
        {/* Image Slider */}
        <div className="mb-4">
          <Slider datas={currentArticle.imgSrcs} />
        </div>

        {/* Description Section */}
        <div>
          <ModalDescriptionSection
            article={currentArticle}
            titles={["작성자", "카테고리", "작성일"]}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-end mb-4 gap-4 border-b border-color-gray-200 pb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            disabled={currentIndex === 0}
            className={cn(
              "flex items-center text-sm",
              currentIndex === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            <Link
              to={
                currentIndex > 0
                  ? `/news/${year}/${articles[currentIndex - 1].id}`
                  : "#"
              }
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              이전
            </Link>
          </Button>

          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {articles.length}
          </span>

          <Button
            asChild
            variant="ghost"
            size="sm"
            disabled={currentIndex === articles.length - 1}
            className={cn(
              "flex items-center text-sm",
              currentIndex === articles.length - 1 &&
                "opacity-50 cursor-not-allowed"
            )}
          >
            <Link
              to={
                currentIndex < articles.length - 1
                  ? `/news/${year}/${articles[currentIndex + 1].id}`
                  : "#"
              }
              className="flex items-center gap-1"
            >
              다음
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
