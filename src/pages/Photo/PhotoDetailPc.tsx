import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Slider from "@/components/layouts/Slider";
import { Button } from "@/components/ui/button";

import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import { cn } from "@/lib/utils";

type PhotoDetailPcProps = {
  trainings: ArticleInfoType[];
  current: number;
  training: ArticleInfoType;
};

export const PhotoDetailPc = ({
  trainings,
  current,
  training,
}: PhotoDetailPcProps) => {
  return (
    <DefaultLayout>
      <SheetWrapper>
        {/* Header with Back Button and Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center ext-gray-600 hover:text-gray-900">
            <Link to={`/photo`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              훈련일지로 돌아가기
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Image Slider */}
          <div className="mb-6 md:mb-0 flex justify-center">
            <Slider datas={training.imgSrcs} />
          </div>

          {/* Description Section */}
          <div className="flex-1">
            <ModalDescriptionSection
              article={training}
              titles={["작성자", "참여 인원", "훈련 날짜"]}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-end gap-2">
            <Button
              asChild
              variant="link"
              size="sm"
              disabled={current === 0}
              className={cn(
                "flex items-center",
                current === 0 && "opacity-50 cursor-not-allowed",
              )}
            >
              <Link
                to={current > 0 ? `/photo/${trainings[current - 1].id}` : "#"}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Link>
            </Button>

            <span className="text-sm text-gray-500 px-3">
              {current + 1} / {trainings.length}
            </span>

            <Button
              asChild
              variant="link"
              size="sm"
              disabled={current === trainings.length - 1}
              className={cn(
                "flex items-center",
                current === trainings.length - 1 &&
                  "opacity-50 cursor-not-allowed",
              )}
            >
              <Link
                to={
                  current < trainings.length - 1
                    ? `/photo/${trainings[current + 1].id}`
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
      </SheetWrapper>
    </DefaultLayout>
  );
};
