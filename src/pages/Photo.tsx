import { useEffect, useState } from "react";
import ThumbnailCard from "../components/Photo/ThumbnailCard";
import DefaultLayout from "../layouts/DefaultLayout";

import PhotoModal from "../components/Modals/PhotoModal";
import PhotoCardContainer from "../components/Photo/PhotoCardContainer";
import SheetWrapper from "../layouts/SheetWrapper";
import Title from "../layouts/Title";

import { redirect, useParams } from "react-router-dom";
import useBodyScrollLock from "../Hooks/useBodyScrollLock";
import useKeyEscClose from "../Hooks/useKeyEscClose";
import MyHelmet from "../helmet/MyHelmet";
import { useTrainings } from "../recoills/tranings";

// TODO 무한 스크롤 구현
function Photo() {
  const openModal = () => {
    setModalOpen(true);
    lockScroll();
  };

  const closeModal = () => {
    setModalOpen(false);
    openScroll();
  };
  const handleClickCard = (index: number) => {
    if (!modalOpen) {
      openModal();
      setPhotoIdx(index);
    }
  };

  const { id } = useParams<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [photoIdx, setPhotoIdx] = useState<number>(0);
  const escKey = useKeyEscClose(closeModal);
  const { lockScroll, openScroll } = useBodyScrollLock();

  const { trainings, fetch } = useTrainings();

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (trainings && id) {
      if (parseInt(id) < trainings.length) {
        if (!modalOpen) {
          setModalOpen(true);
          lockScroll();
          setPhotoIdx(parseInt(id));
        }
      }
    } else {
      redirect("./photo");
    }
  }, [id, lockScroll, modalOpen, trainings]);

  return (
    <>
      <MyHelmet helmet="Photo" />
      <DefaultLayout>
        <SheetWrapper>
          <Title title={"훈련일지"} color="black" />
          <PhotoCardContainer>
            {trainings.map((trainingLog, index) => {
              return (
                <ThumbnailCard
                  key={trainingLog.id}
                  imgSrc={trainingLog?.imgSrcs[0] ?? ""}
                  dateTime={trainingLog.dateTime}
                  handleClickCard={handleClickCard}
                  index={index}
                />
              );
            })}
          </PhotoCardContainer>

          {modalOpen ? (
            <PhotoModal
              open={modalOpen}
              close={closeModal}
              infos={trainings}
              index={photoIdx}
              titles={["작성자", "참여 인원", "훈련 날짜"]}
            />
          ) : (
            <></>
          )}
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default Photo;
