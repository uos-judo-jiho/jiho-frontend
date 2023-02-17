import { useState } from "react";
import ThumbnailCard from "../components/Photo/ThumbnailCard";
import DefaultLayout from "../layouts/DefaultLayout";

import BGImage from "../assets/images/demo.jpg";
import BGImage1 from "../assets/images/demo1.jpg";
import PhotoModal from "../components/Modals/PhotoModal";
import PhotoCardContainer from "../components/Photo/PhotoCardContainer";
import SheetWrapper from "../layouts/SheetWrapper";
import Title from "../layouts/Title";

import TrainingLogDatas from "../assets/jsons/trainingLog.json";
import { useKeyEscClose } from "../Hooks/useKeyEscClose";

function Photo() {
  const [modalOpen, setModalOpen] = useState(false);
  const escKey = useKeyEscClose(closeModal);

  function openModal() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }
  function handleClickCard() {
    if (!modalOpen) openModal();
    console.log(modalOpen);
  }

  return (
    <DefaultLayout>
      <SheetWrapper>
        <Title title={"훈련일지"} />
        {/* 
        TODO mapping PhotoCardContainer와 ThumbnailCard 
        TODO mapping ThumbnailCard imgSrc, dateTime 
        */}

        <PhotoCardContainer>
          {TrainingLogDatas.trainingLogs.map((trainingLog) => {
            return (
              <ThumbnailCard
                // TODO imgSrc Api 적용
                imgSrc={BGImage}
                dateTime={trainingLog.dateTime}
                handleClickCard={handleClickCard}
              />
            );
          })}
        </PhotoCardContainer>

        <PhotoModal
          open={modalOpen}
          close={closeModal}
          info={[BGImage, BGImage1]}
        />
      </SheetWrapper>
    </DefaultLayout>
  );
}

export default Photo;
