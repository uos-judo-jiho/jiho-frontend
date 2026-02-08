import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import MobileHeader from "@/components/common/MobileHeader/MobileHeader";
import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import Loading from "@/components/common/Skeletons/Loading";
import Slider from "@/components/layouts/Slider";
import { Button } from "@/components/ui/button";

import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { cn } from "@/shared/lib/utils";

type PhotoDetailMobileProps = {
  trainings: ArticleInfoType[];
  current: number;
  training: ArticleInfoType | undefined;
};

export const PhotoDetailMobile = ({
  training,
  current,
  trainings,
}: PhotoDetailMobileProps) => {
  if (!training) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader backUrl="/photo" subTitle="훈련일지" subTitleUrl="/photo" />
      <div className="flex-1">
        {/* Image Slider */}
        <div className="mb-4">
          <Slider datas={training.imgSrcs} />
        </div>

        {/* Description Section */}
        <div>
          <ModalDescriptionSection
            article={training}
            titles={["작성자", "참여 인원", "훈련 날짜"]}
          />
        </div>
        {/* Navigation */}
        <div className="flex items-center justify-end mb-4 gap-4 border-b border-color-gray-200 pb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            disabled={current === 0}
            className={cn(
              "flex items-center text-sm",
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

          <span className="text-sm text-gray-500">
            {current + 1} / {trainings.length}
          </span>

          <Button
            asChild
            variant="ghost"
            size="sm"
            disabled={current === trainings.length - 1}
            className={cn(
              "flex items-center text-sm",
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
    </div>
  );
};
