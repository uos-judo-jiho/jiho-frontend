import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as Close } from "../../assets/svgs/close.svg";
import { StyledBackArrow, StyledForwardArrow } from "../../layouts/Arrow";
import ImgSlider from "../../layouts/ImgSlider";
import Row from "../../layouts/Row";
import { TrainingLogInfoTpye } from "../../types/trainingLogInfoType";
import ModalDescriptionSection from "./ModalDescriptionSection";

type PhotoModalProps = {
  open: boolean;
  close: React.MouseEventHandler<HTMLButtonElement>;
  infos: TrainingLogInfoTpye[];
  index: number;
};

const ModalArticleAnimation = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`;

const ContainerAnimation = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const Container = styled.div`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);

  &.openModal {
    display: flex;
    align-items: center;
    /* 팝업이 열릴때 스르륵 열리는 효과 */
    animation: ${ContainerAnimation} 0.3s;
  }
`;

const ModalArticle = styled.article`
  width: 80%;
  height: 80%;
  margin: auto;
  border-radius: 0.3rem;
  background-color: #fff;
  /* 팝업이 열릴때 스르륵 열리는 효과 */
  animation: ${ModalArticleAnimation} 0.3s;
  overflow: hidden;
`;

const StyledClose = styled(Close)``;

const CloseBtn = styled.button`
  position: fixed;
  z-index: 999;
  top: 12%;
  right: 12%;
  background-color: transparent;
`;

const Main = styled.main`
  padding: 1rem;
  width: 100%;
  height: 100%;
`;

function PhotoModal({ open, close, infos, index }: PhotoModalProps) {
  const [current, setCurrent] = useState<number>(index);
  const [info, setInfo] = useState<TrainingLogInfoTpye>(infos[index]);
  const length = infos.length;

  useEffect(() => {
    setInfo(infos[current]);
  }, [current]);

  function nextSlider() {
    setCurrent(current + 1);
  }

  function prevSlider() {
    setCurrent(current - 1);
  }
  return (
    <>
      <Container className={open ? "openModal" : ""}>
        {open && info ? (
          <ModalArticle>
            <StyledBackArrow
              onClick={prevSlider}
              current={current}
              length={length}
            />
            <StyledForwardArrow
              onClick={nextSlider}
              current={current}
              length={length}
            />
            <CloseBtn onClick={close}>
              <StyledClose />
            </CloseBtn>
            <Main>
              <Row>
                <ImgSlider datas={info.imgSrcs} />
                <ModalDescriptionSection
                  id={info.id}
                  title={info.title}
                  author={info.author}
                  dateTime={info.dateTime}
                  subTitle={info.subTitle}
                  description={info.description}
                  imgSrcs={[]}
                ></ModalDescriptionSection>
              </Row>
            </Main>
          </ModalArticle>
        ) : (
          <></>
        )}
      </Container>
    </>
  );
}

export default PhotoModal;
