import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import MobileHeader from "@/components/common/MobileHeader/MobileHeader";
import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import Loading from "@/components/common/Skeletons/Loading";
import Slider from "@/components/layouts/Slider";
import { Button } from "@/components/ui/button";
import MyHelmet from "@/helmet/MyHelmet";

import { useTrainingListQuery } from "@/api/trainings/query";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export const PhotoDetailMobile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useTrainingListQuery();

  // 날짜순 정렬
  const trainings = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [data]);

  const current =
    trainings?.findIndex((item) => item.id.toString() === id?.toString()) ?? -1;

  const info = trainings?.find((item) => item.id.toString() === id?.toString());

  // 스와이프 네비게이션
  const { onTouchStart, onTouchEnd } = useSwipeNavigation({
    onSwipeUp: () => {
      // 위로 스와이프 = 다음 페이지
      if (current < trainings.length - 1) {
        navigate(`/photo/${trainings[current + 1].id}`);
      }
    },
    onSwipeDown: () => {
      // 아래로 스와이프 = 이전 페이지
      if (current > 0) {
        navigate(`/photo/${trainings[current - 1].id}`);
      }
    },
  });

  if (!trainings || !info) {
    return <Loading />;
  }

  const metaDescription = [info.title, info.description.slice(0, 80)].join(
    " | "
  );

  const metaImgUrl = info.imgSrcs.at(0);

  return (
    <div className="min-h-screen flex flex-col">
      <MyHelmet
        title={`훈련일지 - ${info.title}`}
        description={metaDescription}
        imgUrl={metaImgUrl}
      />

      <MobileHeader backUrl="/photo" subTitle="훈련일지" subTitleUrl="/photo" />

      <div
        className="flex-1 px-4 py-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Image Slider */}
        <div className="mb-4">
          <Slider datas={info.imgSrcs} />
        </div>

        {/* Description Section */}
        <div>
          <ModalDescriptionSection
            article={info}
            titles={["작성자", "참여 인원", "훈련 날짜"]}
          />
        </div>
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            disabled={current === 0}
            className={cn(
              "flex items-center text-sm",
              current === 0 && "opacity-50 cursor-not-allowed"
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
                "opacity-50 cursor-not-allowed"
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
