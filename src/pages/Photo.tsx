import { useEffect, useState } from "react";
import ThumbnailCard from "../components/Photo/ThumbnailCard";
import DefaultLayout from "../layouts/DefaultLayout";

import PhotoModal from "../components/Modals/PhotoModal";
import PhotoCardContainer from "../components/Photo/PhotoCardContainer";
import SheetWrapper from "../layouts/SheetWrapper";
import Title from "../layouts/Title";

import { useSearchParams } from "react-router-dom";
import useBodyScrollLock from "../Hooks/useBodyScrollLock";
import useKeyEscClose from "../Hooks/useKeyEscClose";
import Loading from "../components/Skeletons/Loading";
import SkeletonThumbnail from "../components/Skeletons/SkeletonThumbnail";
import { StorageKey } from "../constant/storageKey";
import MyHelmet from "../helmet/MyHelmet";
import { useTrainings } from "../recoills/tranings";

const Photo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const id = searchParams.get("p") || "";
  const { lockScroll, openScroll } = useBodyScrollLock();

  const { trainings, fetch, isLoad } = useTrainings();

  const openModal = () => {
    setModalOpen(true);
    lockScroll();
  };

  const closeModal = () => {
    setModalOpen(false);
    openScroll();
    sessionStorage.setItem(
      StorageKey.sessionStorage.modal_open.training,
      "false"
    );
  };

  const handleClickCard = (id: number | string) => {
    if (!modalOpen) {
      openModal();
      setSearchParams({ p: id.toString() });
      sessionStorage.setItem(
        StorageKey.sessionStorage.modal_open.training,
        "true"
      );
    }
  };

  useKeyEscClose(closeModal);

  useEffect(() => {
    fetch();

    return () => {
      sessionStorage.setItem(
        StorageKey.sessionStorage.modal_open.training,
        "true"
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sessionModalOpen =
      sessionStorage.getItem(StorageKey.sessionStorage.modal_open.training) ===
      "true";

    if (trainings && id && sessionModalOpen) {
      setModalOpen(true);
      lockScroll();
    }
  }, [id, lockScroll, trainings]);

  if (!trainings) {
    return <Loading />;
  }

  const metaDescription = [
    trainings.at(0)?.title,
    trainings.at(0)?.description.slice(0, 80),
  ].join(" | ");

  const metaImgUrl = trainings.at(0)?.imgSrcs.at(0);

  return (
    <>
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
          open={modalOpen}
          close={closeModal}
          infos={trainings}
          id={id}
          titles={["작성자", "참여 인원", "훈련 날짜"]}
        />
      )}
    </>
  );
};

export default Photo;
