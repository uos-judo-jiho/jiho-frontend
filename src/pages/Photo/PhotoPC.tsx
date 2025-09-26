import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PhotoCardContainer from "@/components/Photo/PhotoCardContainer";
import ThumbnailCard from "@/components/Photo/ThumbnailCard";
import PhotoModal from "@/components/common/Modals/PhotoModal";
import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";

import MyHelmet from "@/helmet/MyHelmet";

import useKeyEscClose from "@/hooks/useKeyEscClose";

import { useTrainings } from "@/recoils/tranings";

const PhotoPC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.replace("photo", "").split("/").at(-1) ?? "";
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { trainings } = useTrainings();

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  const handleClickCard = (id: number | string) => {
    openModal();
    navigate(`/photo/${id}`, { replace: true });
  };

  useKeyEscClose(closeModal);

  useEffect(() => {
    if (trainings && id) {
      setModalOpen(true);
    }
  }, [id, trainings]);

  // SSR-friendly: Provide fallback meta data even when trainings is empty
  const metaDescription = trainings?.length ? [
    trainings.at(0)?.title,
    trainings.at(0)?.description.slice(0, 80),
  ].join(" | ") : "서울시립대학교 유도부 지호 - 훈련일지";

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
      {modalOpen && trainings && (
        <PhotoModal
          baseurl={"photo"}
          open={modalOpen}
          close={closeModal}
          infos={trainings}
          id={id}
          titles={["작성자", "참여 인원", "훈련 날짜"]}
        />
      )}
    </div>
  );
};

export default PhotoPC;
