import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import MobileHeader from "@/components/common/MobileHeader/MobileHeader";
import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import Loading from "@/components/common/Skeletons/Loading";
import Slider from "@/components/layouts/Slider";
import { Button } from "@/components/ui/button";
import MyHelmet from "@/helmet/MyHelmet";

import { cn } from "@/lib/utils";
import { NewsDetailPageProps } from "./types/NewsDetailPageProps";
import Footer from "@/components/common/Footer/footer";

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

  if (!currentArticle) {
    return <Loading />;
  }

  const metaDescription = [
    currentArticle.title,
    currentArticle.description.slice(0, 80),
  ].join(" | ");

  const metaImgUrl = currentArticle.imgSrcs.at(0);

  return (
    <div className="min-h-screen flex flex-col">
      <MyHelmet
        title={`${year}년 지호지 - ${currentArticle.title}`}
        description={metaDescription}
        imgUrl={metaImgUrl}
      />

      <MobileHeader
        backUrl={`/news/${year}`}
        subTitle="지호지"
        subTitleUrl={`/news/${year}`}
      />

      <div className="flex-1 px-4 py-4">
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
        <div className="flex items-center justify-end mb-4 gap-4">
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
