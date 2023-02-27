import { useEffect, useState } from "react";
import ThumbnailCard from "../components/Photo/ThumbnailCard";
import DefaultLayout from "../layouts/DefaultLayout";

import PhotoModal from "../components/Modals/PhotoModal";
import PhotoCardContainer from "../components/Photo/PhotoCardContainer";
import SheetWrapper from "../layouts/SheetWrapper";
import Title from "../layouts/Title";

import TrainingLogDatas from "../assets/jsons/trainingLog.json";
import { useBodyScrollLock } from "../Hooks/useBodyScrollLock";
import { useKeyEscClose } from "../Hooks/useKeyEscClose";
import { ArticleInfoType } from "../types/ArticleInfoType";
import MyHelmet from "../helmet/MyHelmet";

function Photo() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [photoIdx, setPhotoIdx] = useState<number>(0);
  const escKey = useKeyEscClose(closeModal);
  const { lockScroll, openScroll } = useBodyScrollLock();

  const [trainingLogArray, setTrainingLogArray] = useState<ArticleInfoType[]>(
    []
  );

  useEffect(() => {
    const trainingLogDatas = TrainingLogDatas;
    setTrainingLogArray(trainingLogDatas.trainingLogs.slice(0).reverse());
  }, []);

  function openModal() {
    setModalOpen(true);
    lockScroll();
  }
  function closeModal() {
    setModalOpen(false);
    openScroll();
  }
  function handleClickCard(index: number) {
    if (!modalOpen) {
      openModal();
      setPhotoIdx(index);
    }
  }

  if (!Array.isArray(trainingLogArray) || trainingLogArray.length <= 0) {
    return null;
  }

  return (
    <>
      <MyHelmet helmet="Photo" />
      <DefaultLayout>
        <SheetWrapper>
          <Title title={"훈련일지"} color="black" />
          <PhotoCardContainer>
            {trainingLogArray.map((trainingLog, index) => {
              return (
                <ThumbnailCard
                  // TODO imgSrc Api 적용
                  key={"trainingLog" + trainingLog.id}
                  imgSrc={trainingLog.imgSrcs[0]}
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
              infos={trainingLogArray}
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
