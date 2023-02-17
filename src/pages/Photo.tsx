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
  const [photoIdx, setPhotoIdx] = useState(0);
  const escKey = useKeyEscClose(closeModal);

  function openModal() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }
  function handleClickCard(index: number) {
    if (!modalOpen) {
      openModal();
      setPhotoIdx(index);
    }
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
          {TrainingLogDatas.trainingLogs.map((trainingLog, index) => {
            return (
              <ThumbnailCard
                // TODO imgSrc Api 적용
                key={trainingLog.id}
                imgSrc={BGImage}
                dateTime={trainingLog.dateTime}
                handleClickCard={handleClickCard}
                index={index}
              />
            );
          })}
        </PhotoCardContainer>

        <PhotoModal
          open={modalOpen}
          close={closeModal}
          info={{
            imgSrcs: TrainingLogDatas.trainingLogs[photoIdx].imgSrcs,
            dateTime: TrainingLogDatas.trainingLogs[photoIdx].dateTime,
            title: TrainingLogDatas.trainingLogs[photoIdx].title,
            subTitle: TrainingLogDatas.trainingLogs[photoIdx].subTitle,
            description: TrainingLogDatas.trainingLogs[photoIdx].description,
          }}
        />
      </SheetWrapper>
    </DefaultLayout>
  );
}

export default Photo;
