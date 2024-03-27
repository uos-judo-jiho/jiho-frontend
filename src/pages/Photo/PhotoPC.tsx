import { useCallback, useEffect, useState } from "react";
import ThumbnailCard from "../../components/Photo/ThumbnailCard";
import DefaultLayout from "../../layouts/DefaultLayout";

import PhotoModal from "../../components/Modals/PhotoModal";
import PhotoCardContainer from "../../components/Photo/PhotoCardContainer";
import SheetWrapper from "../../layouts/SheetWrapper";
import Title from "../../layouts/Title";

import { useLocation, useNavigate } from "react-router-dom";
import useBodyScrollLock from "../../Hooks/useBodyScrollLock";
import useKeyEscClose from "../../Hooks/useKeyEscClose";
import Loading from "../../components/Skeletons/Loading";
import SkeletonThumbnail from "../../components/Skeletons/SkeletonThumbnail";
import MyHelmet from "../../helmet/MyHelmet";
import { useTrainings } from "../../recoills/tranings";

const PhotoPC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.replace("photo", "").split("/").at(-1) ?? "";
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { openScroll, lockScroll } = useBodyScrollLock();

  const { trainings, fetch, isLoad } = useTrainings();

  const openModal = useCallback(() => {
    setModalOpen(true);
    lockScroll();
  }, [lockScroll]);

  const closeModal = () => {
    setModalOpen(false);
    openScroll();
  };

  const handleClickCard = (id: number | string) => {
    openModal();
    navigate(`/photo/${id}`, { replace: true });
  };

  useKeyEscClose(closeModal);

  useEffect(() => {
    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (trainings && id) {
      openModal();
    }
  }, [id, openModal, trainings]);

  useEffect(() => {
    if (!modalOpen || !id) {
      openScroll();
    }
    return () => {
      openScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!trainings) {
    return <Loading />;
  }

  const metaDescription = [
    trainings.at(0)?.title,
    trainings.at(0)?.description.slice(0, 80),
  ].join(" | ");

  const metaImgUrl = trainings.at(0)?.imgSrcs.at(0);

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
            {isLoad
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
      {modalOpen && (
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
