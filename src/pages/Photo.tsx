import { useEffect, useState } from "react";
import ThumbnailCard from "../components/Photo/ThumbnailCard";
import DefaultLayout from "../layouts/DefaultLayout";

import PhotoModal from "../components/Modals/PhotoModal";
import PhotoCardContainer from "../components/Photo/PhotoCardContainer";
import SheetWrapper from "../layouts/SheetWrapper";
import Title from "../layouts/Title";

import { redirect, useParams } from "react-router-dom";
import useBodyScrollLock from "../Hooks/useBodyScrollLock";
import useFetchData from "../Hooks/useFetchData";
import useKeyEscClose from "../Hooks/useKeyEscClose";
import { getTrainings } from "../api/trainingApi";
import MyHelmet from "../helmet/MyHelmet";
import { ArticleInfoType } from "../types/ArticleInfoType";

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

  const [trainingLogArray, setTrainingLogArray] = useState<ArticleInfoType[]>();

  /*
    TODO 
    훈련일지는 모든 데이터 필요 
    1. 퀴리 요청에서 순차적으로 2022, 2023, ... 으로 프론트에서 계속 요청
    2. 백에서 한번에 다주기
  */
  const { loading, error, response } = useFetchData(getTrainings, "2022");

  useEffect(() => {
    if (!loading && !error && response) {
      const reversedDatas = response.trainingLogs.slice(0).reverse();
      setTrainingLogArray(reversedDatas);
    }
  }, [loading, error, response]);

  useEffect(() => {
    if (trainingLogArray && id) {
      if (parseInt(id) < trainingLogArray.length) {
        if (!modalOpen) {
          setModalOpen(true);
          lockScroll();
          setPhotoIdx(parseInt(id));
        }
      }
    } else {
      redirect("./photo");
    }
  }, [id, lockScroll, modalOpen, trainingLogArray]);

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
                  key={"trainingLog" + trainingLog.id}
                  imgSrc={trainingLog.imgSrcs ? trainingLog.imgSrcs[0] : ""}
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
