import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Slider from "@/components/layouts/Slider";
import { Button } from "@/components/ui/button";
import MyHelmet from "@/helmet/MyHelmet";
import { NewsDetailPageProps } from "./types/NewsDetailPageProps";

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const NewsDetailPc = ({ news, year, newsId }: NewsDetailPageProps) => {
  const articles = news.articles;
  const currentIndex = articles.findIndex(
    (article) => article.id.toString() === newsId
  );

  const currentArticle = articles[currentIndex];

  if (!currentArticle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg font-semibold">
          해당 지호지를 찾을 수 없습니다.
        </div>
        <Link to={`/news/${year}`} className="text-blue-500 underline">
          {year}년 지호지 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const metaDescription = [
    currentArticle.title,
    currentArticle.description.slice(0, 80),
  ].join(" | ");

  const metaImgUrl = currentArticle.imgSrcs.at(0);

  return (
    <div>
      <MyHelmet
        title={`${year}년 지호지 - ${currentArticle.title}`}
        description={metaDescription}
        imgUrl={metaImgUrl}
      />

      <DefaultLayout>
        <SheetWrapper>
          {/* Header with Back Button and Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              asChild
              variant="ghost"
              className="flex items-center ext-gray-600 hover:text-gray-900"
            >
              <Link to={`/news/${year}`} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {year}년 지호지로 돌아가기
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="link"
                size="sm"
                disabled={currentIndex === 0}
                className={cn(
                  "flex items-center",
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

              <span className="text-sm text-gray-500 px-3">
                {currentIndex + 1} / {articles.length}
              </span>

              <Button
                asChild
                variant="link"
                size="sm"
                disabled={currentIndex === articles.length - 1}
                className={cn(
                  "flex items-center",
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
                  aria-disabled={currentIndex === articles.length - 1}
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1">
            {/* Image Slider */}
            <div className="mb-6 md:mb-0 flex justify-center h-[300px]">
              <Slider datas={currentArticle.imgSrcs} />
            </div>

            {/* Description Section */}
            <div className="flex-1">
              <ModalDescriptionSection
                article={currentArticle}
                titles={["작성자", "카테고리", "작성일"]}
              />
            </div>
          </div>
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};
