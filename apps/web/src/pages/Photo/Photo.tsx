import { useNavigate } from "@tanstack/react-router";
import { Suspense, useMemo } from "react";

import PhotoCardContainer from "@/components/Photo/PhotoCardContainer";
import ThumbnailCard from "@/components/Photo/ThumbnailCard";
import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";

import { v2Api } from "@packages/api";

const PhotoPC = () => {
  const navigate = useNavigate();

  const { data } = v2Api.useGetApiV2TrainingsSuspense(undefined, {
    query: {
      select: (response) => response.data.trainingLogs,
    },
  });

  // 날짜순 정렬
  const trainings = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [data]);

  const handleClickCard = (id: number | string) => {
    navigate({ to: "/photo/$id", params: { id: String(id) } });
  };

  return (
    <div>
      <DefaultLayout>
        <SheetWrapper>
          <Title title={"훈련일지"} color="black" />
          <PhotoCardContainer>
            {trainings.map((trainingLog) => (
              <Suspense key={trainingLog.id} fallback={<SkeletonThumbnail />}>
                <ThumbnailCard
                  imgSrc={trainingLog.images[0]}
                  dateTime={trainingLog.dateTime}
                  handleClickCard={handleClickCard}
                  id={trainingLog.id}
                />
              </Suspense>
            ))}
          </PhotoCardContainer>
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};

export default PhotoPC;
