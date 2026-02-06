import { Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import PhotoCardContainer from "@/components/Photo/PhotoCardContainer";
import ThumbnailCard from "@/components/Photo/ThumbnailCard";
import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";

import { useTrainingListQuery } from "@/features/api/trainings/query";
import { StructuredData, createImageGalleryData } from "@/features/seo";
import MyHelmet from "@/features/seo/helmet/MyHelmet";

const PhotoPC = () => {
  const navigate = useNavigate();
  const { data } = useTrainingListQuery();

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
            {trainings.map((trainingLog) => (
              <Suspense key={trainingLog.id} fallback={<SkeletonThumbnail />}>
                <ThumbnailCard
                  imgSrc={trainingLog?.imgSrcs.at(0) ?? ""}
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
