import { useEffect, useState } from "react";
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
import { TrainingLogInfoTpye } from "../types/trainingLogInfoType";

function Photo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const escKey = useKeyEscClose(closeModal);

  const [trainingLogArray, setTrainingLogArray] = useState<
    TrainingLogInfoTpye[]
  >([]);

  useEffect(() => {
    const trainingLogDatas = TrainingLogDatas;
    setTrainingLogArray(trainingLogDatas.trainingLogs.slice(0).reverse());
  }, []);

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

  if (trainingLogArray.length === 0) {
    return <></>;
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
          {trainingLogArray.map((trainingLog, index) => {
            return (
              <ThumbnailCard
                // TODO imgSrc Api 적용
                key={"trainingLog" + trainingLog.id}
                imgSrc={BGImage}
                dateTime={trainingLog.dateTime}
                handleClickCard={handleClickCard}
                index={index}
              />
            );
          })}
        </PhotoCardContainer>
        {trainingLogArray ? (
          <PhotoModal
            open={modalOpen}
            close={closeModal}
            info={{
              id: trainingLogArray[photoIdx].id,
              imgSrcs: trainingLogArray[photoIdx].imgSrcs,
              dateTime: trainingLogArray[photoIdx].dateTime,
              author: trainingLogArray[photoIdx].author,
              title: trainingLogArray[photoIdx].title,
              subTitle: trainingLogArray[photoIdx].subTitle,
              description: trainingLogArray[photoIdx].description,
            }}
          />
        ) : (
          <></>
        )}
      </SheetWrapper>
    </DefaultLayout>
  );
}

export default Photo;
