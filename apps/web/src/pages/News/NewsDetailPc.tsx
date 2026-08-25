import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Slider from "@/components/layouts/Slider";

import { v2Api } from "@packages/api";

const routeApi = getRouteApi("/news/$id/$newsId");

export const NewsDetailPc = () => {
  const { id, newsId: index } = routeApi.useParams();

  const { data: news } = v2Api.useGetApiV2NewsYearIdSuspense(
    Number(id),
    Number(index),
    {
      query: {
        select: (result) => result.data,
      },
    },
  );

  const { article, year } = news ?? { article: null, year: Number(id) };

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg font-semibold">
          해당 지호지를 찾을 수 없습니다.
        </div>
        <Link
          to="/news/$id"
          params={{ id: String(year) }}
          className="text-blue-500 underline"
        >
          {year}년 지호지 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <DefaultLayout>
        <SheetWrapper>
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center ext-gray-600 hover:text-gray-900">
              <Link
                to="/news/$id"
                params={{ id: String(year) }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {year}년 지호지로 돌아가기
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1">
            {/* Image Slider */}
            <div className="mb-6 md:mb-0 flex justify-center">
              <Slider datas={article.images} />
            </div>

            {/* Description Section */}
            <div className="flex-1">
              <ModalDescriptionSection
                article={article}
                titles={["작성자", "카테고리", "작성일"]}
              />
            </div>
          </div>

          {/* Navigation */}
          {/* <div className="flex items-center justify-end gap-2">
            <Button
              asChild
              variant="link"
              size="sm"
              disabled={currentIndex === 0}
              className={cn(
                "flex items-center",
                currentIndex === 0 && "opacity-50 cursor-not-allowed",
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
                  "opacity-50 cursor-not-allowed",
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
          </div> */}
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};
