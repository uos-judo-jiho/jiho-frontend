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
import MyHelmet from "../helmet/MyHelmet";
import { useTrainings } from "../recoills/tranings";

const Photo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const id = searchParams.get("p") || "";
  const { lockScroll, openScroll } = useBodyScrollLock();

  const { trainings, fetch } = useTrainings();

  const metaImgUrl = trainings[0].imgSrcs[0];

  const openModal = () => {
    setModalOpen(true);
    lockScroll();
  };

  const closeModal = () => {
    setModalOpen(false);
    openScroll();
  };

  const handleClickCard = (id: number | string) => {
    if (!modalOpen) {
      openModal();
      setSearchParams({ p: id.toString() });
    }
  };

  useKeyEscClose(closeModal);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (trainings && id) {
      setModalOpen(true);
      lockScroll();
    }
  }, [id, lockScroll, trainings]);

  const metaDescription = [
    trainings[0].title,
    trainings[0].description.slice(0, 80),
  ].join(" | ");

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
            {trainings.map((trainingLog) => (
              <ThumbnailCard
                key={trainingLog.id}
                imgSrc={trainingLog?.imgSrcs[0] ?? ""}
                dateTime={trainingLog.dateTime}
                handleClickCard={handleClickCard}
                id={trainingLog.id}
              />
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
