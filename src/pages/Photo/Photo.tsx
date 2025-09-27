import { useNavigate } from "react-router-dom";

import PhotoCardContainer from "@/components/Photo/PhotoCardContainer";
import ThumbnailCard from "@/components/Photo/ThumbnailCard";
import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";

import MyHelmet from "@/helmet/MyHelmet";
import { useTrainings } from "@/recoils/tranings";

const PhotoPC = () => {
  const navigate = useNavigate();
  const { trainings } = useTrainings();

  const handleClickCard = (id: number | string) => {
    navigate(`/photo/${id}`);
  };

  // SSR-friendly: Provide fallback meta data even when trainings is empty
  const metaDescription = trainings?.length
    ? [trainings.at(0)?.title, trainings.at(0)?.description.slice(0, 80)].join(
        " | "
      )
    : "서울시립대학교 유도부 지호 - 훈련일지";

  const metaImgUrl = trainings?.at(0)?.imgSrcs.at(0);

  return (
    <div>
      <MyHelmet
        title="Photo"
        description={metaDescription}
        imgUrl={metaImgUrl}
      />
      <DefaultLayout>
        <SheetWrapper>
          <Title title={"훈련일지"} color="black" />
          <PhotoCardContainer>
            {trainings && trainings.length > 0
              ? trainings.map((trainingLog) => (
                  <ThumbnailCard
                    key={trainingLog.id}
                    imgSrc={trainingLog?.imgSrcs.at(0) ?? ""}
                    dateTime={trainingLog.dateTime}
                    handleClickCard={handleClickCard}
                    id={trainingLog.id}
                  />
                ))
              : Array.from({ length: 9 }).map((_, index) => (
                  <SkeletonThumbnail key={index} />
                ))}
          </PhotoCardContainer>
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};

export default PhotoPC;