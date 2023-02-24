import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as Close } from "../../assets/svgs/close.svg";
import { StyledBackArrow, StyledForwardArrow } from "../../layouts/Arrow";
import ImgSlider from "../../layouts/ImgSlider";
import MobileRowColLayout from "../../layouts/MobileRowColLayout";
import Row from "../../layouts/Row";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import ModalDescriptionSection from "./ModalDescriptionSection";

type PhotoModalProps = {
  open: boolean;
  close: React.MouseEventHandler<HTMLButtonElement>;
  infos: ArticleInfoType[];
  index: number;
  titles: string[];
};

const IndexContainer = styled.div`
  display: block;
  position: absolute;
  padding-top: 1rem;
  left: 50%;
`;
const IndexSpan = styled.span`
  font-size: ${(props) => props.theme.tinyFontSize};
  display: block;
  color: ${(props) => props.theme.greyColor};
`;

/**
 * 팝업이 닫힐때 스르륵 닫히는 효과
 */
const ContainerCloseAnimation = keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
`;
/**
 * 팝업이 열릴때 스르륵 열리는 효과
 */
const ContainerOpenAnimation = keyframes`
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
  transition: all 0.3s;

  &.openModal {
    display: flex;
    align-items: center;
    animation: ${ContainerOpenAnimation};
  }
`;

const ModalArticle = styled.article`
  width: 80%;
  height: 80%;
  margin: auto;
  border-radius: 0.3rem;
  background-color: #fff;
  animation: ${ContainerOpenAnimation} 0.3s;
  overflow: hidden;
`;

const StyledClose = styled(Close)``;

const CloseBtn = styled.button`
  position: fixed;
  z-index: 999;
  top: 12%;
  right: 12%;
  width: 40px;
  height: 40px;
  background-color: transparent;

  @media (max-width: 539px) {
    top: 0;
    right: 0;
  }
`;

const Main = styled.main`
  padding: 1rem;
  width: 100%;
  height: 100%;
`;

function PhotoModal({ open, close, infos, index, titles }: PhotoModalProps) {
  const [current, setCurrent] = useState<number>(index);
  const [info, setInfo] = useState<ArticleInfoType>(infos[index]);
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
    <Container className={open ? "openModal" : ""}>
      {open && info ? (
        <ModalArticle>
          <StyledBackArrow
            size={"40px"}
            onClick={prevSlider}
            current={current}
            length={length}
          />
          <StyledForwardArrow
            size={"40px"}
            onClick={nextSlider}
            current={current}
            length={length}
          />

          <CloseBtn onClick={close}>
            <StyledClose />
          </CloseBtn>
          <Main>
            <MobileRowColLayout>
              <ImgSlider datas={info.imgSrcs} />
              <ModalDescriptionSection article={info} titles={titles} />
            </MobileRowColLayout>
          </Main>
          <IndexContainer>
            <IndexSpan>{current + 1 + " / " + length}</IndexSpan>
          </IndexContainer>
        </ModalArticle>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default PhotoModal;
