import { getRouteApi, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Footer from "@/components/common/Footer/footer";
import MobileHeader from "@/components/common/MobileHeader/MobileHeader";
import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import Loading from "@/components/common/Skeletons/Loading";
import Slider from "@/components/layouts/Slider";
import { Button } from "@/components/ui/button";

import { cn } from "@/shared/lib/utils";
import { v2Api } from "@packages/api";

const routeApi = getRouteApi("/news/$id/$newsId");

export const NewsDetailMobile = () => {
  const { id: year, newsId } = routeApi.useParams();

  const { data } = v2Api.useGetApiV2NewsYearSuspense(Number(year));

  const news = data.data;

  const articles = news.articles;
  const currentIndex = articles.findIndex(
    (article) => article.id.toString() === newsId,
  );

  const currentArticle = articles[currentIndex];

  if (!currentArticle) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col px-2">
      <MobileHeader
        backUrl={`/news/${year}`}
        subTitle={`${year} 지호지`}
        subTitleUrl={`/news/${year}`}
      />

      <div className="flex-1">
        {/* Image Slider */}
        <div className="mb-4">
          <Slider datas={currentArticle.images} />
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
              currentIndex === 0 && "opacity-50 cursor-not-allowed",
            )}
          >
            <Link
              to="/news/$id/$newsId"
              params={{
                id: String(year),
                newsId: String(articles[Math.max(currentIndex - 1, 0)].id),
              }}
              disabled={currentIndex === 0}
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
                "opacity-50 cursor-not-allowed",
            )}
          >
            <Link
              to="/news/$id/$newsId"
              params={{
                id: String(year),
                newsId: String(
                  articles[Math.min(currentIndex + 1, articles.length - 1)].id,
                ),
              }}
              disabled={currentIndex === articles.length - 1}
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
