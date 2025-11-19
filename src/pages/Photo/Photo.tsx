import { useNavigate } from "react-router-dom";

import PhotoCardContainer from "@/components/Photo/PhotoCardContainer";
import ThumbnailCard from "@/components/Photo/ThumbnailCard";
import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";

import MyHelmet from "@/seo/helmet/MyHelmet";
import { useTrainingListQuery } from "@/api/trainings/query";
import { useMemo } from "react";
import { StructuredData, createImageGalleryData } from "@/seo";

const PhotoPC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useTrainingListQuery();

  // 날짜순 정렬
  const trainings = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [data]);

  const handleClickCard = (id: number | string) => {
    navigate(`/photo/${id}`);
  };

  // SSR-friendly: Provide fallback meta data even when trainings is empty
  const metaDescription = trainings?.length
    ? [trainings.at(0)?.title, trainings.at(0)?.description.slice(0, 140)].join(
        " | "
      )
    : "서울시립대학교 유도부 지호 - 훈련일지";

  const metaImgUrl = trainings?.at(0)?.imgSrcs.at(0);

  // Create structured data for image gallery
  const structuredData = useMemo(() => {
    if (!trainings || trainings.length === 0) return null;

    const currentUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "https://uosjudo.com/photo";

    return createImageGalleryData({
      name: "서울시립대학교 유도부 지호 훈련일지",
      description: metaDescription,
      url: currentUrl,
      images: trainings.slice(0, 20).map((training) => ({
        url: training.imgSrcs[0] || "",
        caption: training.title,
        datePublished: training.dateTime
          ? new Date(training.dateTime).toISOString()
          : undefined,
      })),
    });
  }, [trainings, metaDescription]);

  return (
    <div>
      <MyHelmet
        title="Photo"
        description={metaDescription}
        imgUrl={metaImgUrl}
      />
      {structuredData && <StructuredData data={structuredData} />}
      <DefaultLayout>
        <SheetWrapper>
          <Title title={"훈련일지"} color="black" />
          <PhotoCardContainer>
            {!isLoading && trainings.length > 0
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
