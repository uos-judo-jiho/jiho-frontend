import { useState } from "react";
import ThumbnailCard from "../components/Photo/ThumbnailCard";
import DefaultLayout from "../layouts/DefaultLayout";

import BGImage from "../assets/images/demo.jpg";
import PhotoModal from "../components/Modals/PhotoModal";
import PhotoCardContainer from "../components/Photo/PhotoCardContainer";
import SheetWrapper from "../layouts/SheetWrapper";
import Title from "../layouts/Title";

function Photo() {
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
        <PhotoCardContainer>
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
        </PhotoCardContainer>
        <PhotoCardContainer>
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
        </PhotoCardContainer>
        <PhotoModal open={modalOpen} close={closeModal} info={BGImage} />
      </SheetWrapper>
    </DefaultLayout>
  );
}

export default Photo;
