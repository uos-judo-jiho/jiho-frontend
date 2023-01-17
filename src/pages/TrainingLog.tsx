import React, { useState } from "react";
import ThumbnailCard from "../components/TrainingLog/ThumbnailCard";
import TrainingLogCardContainer from "../components/TrainingLog/TrainingLogCardContainer";
import DefaultLayout from "../layouts/DefaultLayout";

import BGImage from "../assets/images/demo.jpg";
import SheetWrapper from "../layouts/SheetWrapper";
import TrainingLogModal from "../components/Modals/TrainingLogModal";
import Title from "../layouts/Title";

function TrainingLog() {
  const [modalOpen, setModalOpen] = useState(false);
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
        <TrainingLogCardContainer>
          <ThumbnailCard
            imgSrc={BGImage}
            handleClickCard={handleClickCard}
          ></ThumbnailCard>
          <ThumbnailCard
            imgSrc={BGImage}
            handleClickCard={handleClickCard}
          ></ThumbnailCard>
          <ThumbnailCard
            imgSrc={BGImage}
            handleClickCard={handleClickCard}
          ></ThumbnailCard>
        </TrainingLogCardContainer>
        <TrainingLogCardContainer>
          <ThumbnailCard
            imgSrc={BGImage}
            handleClickCard={handleClickCard}
          ></ThumbnailCard>
          <ThumbnailCard
            imgSrc={BGImage}
            handleClickCard={handleClickCard}
          ></ThumbnailCard>
          <ThumbnailCard
            imgSrc={BGImage}
            handleClickCard={handleClickCard}
          ></ThumbnailCard>
        </TrainingLogCardContainer>
        <TrainingLogModal open={modalOpen} close={closeModal} info={BGImage} />
      </SheetWrapper>
    </DefaultLayout>
  );
}

export default TrainingLog;
