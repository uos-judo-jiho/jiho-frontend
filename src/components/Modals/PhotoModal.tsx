import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as Close } from "../../assets/svgs/close.svg";
import { useMouseDrag } from "../../Hooks/useMouseDrag";
import { useTouchScroll } from "../../Hooks/useTouchScroll";
import { StyledBackArrow, StyledForwardArrow } from "../../layouts/Arrow";
import ImgSlider from "../../layouts/ImgSlider";
import MobileRowColLayout from "../../layouts/MobileRowColLayout";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import ModalDescriptionSection from "./ModalDescriptionSection";

type PhotoModalProps = {
  open: boolean;
  close: React.MouseEventHandler<HTMLButtonElement>;
  infos: ArticleInfoType[];
  index: number;
  titles: string[];
};

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

const IndexContainer = styled.div`
  display: block;
  position: absolute;
  padding-top: 1rem;
  left: 50%;

  @media (max-width: 539px) {
    display: none;
  }
`;
const IndexSpan = styled.span`
  font-size: ${(props) => props.theme.tinyFontSize};
  display: block;
  color: ${(props) => props.theme.lightGreyColor};
  @media (max-width: 539px) {
    display: none;
  }
`;

const Container = styled.div`
  /* display: none; */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);
  transition: all 0.5s;

  &.openModal {
    display: flex;
    align-items: center;
    animation: ${ContainerOpenAnimation};
  }

  &.closeModal {
    /* TODO close animation */
  }
`;

const MobileModalLayout = styled.div`
  @media (max-width: 539px) {
    width: 100%;
    height: 100%;
    padding-top: 10rem;
  }
`;

const ModalArticle = styled.article`
  width: 80%;
  height: 80vh;
  margin: auto;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.bgColor};
  animation: ${ContainerOpenAnimation} 0.5s;
  overflow: auto;

  @media (max-width: 539px) {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
  }
`;

const StyledClose = styled(Close)``;
const MobileSlideBarWrapper = styled.div`
  display: none;
  @media (max-width: 539px) {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 6px;
    right: 0;
    left: 0;
  }
`;

const MobileSlideBar = styled.hr`
  width: 10%;
  border: 2px solid ${(props) => props.theme.greyColor};
  border-radius: 1rem;
`;
const ArrowWrapper = styled.div`
  @media (max-width: 539px) {
    display: none;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  z-index: 999;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  @media (max-width: 539px) {
    display: none;
  }
`;

const Main = styled.main`
  position: relative;
  padding: 1rem;
  width: 100%;
  height: 100%;
`;

function PhotoModal({ open, close, infos, index, titles }: PhotoModalProps) {
  const [current, setCurrent] = useState<number>(index);
  const [info, setInfo] = useState<ArticleInfoType>(infos[index]);
  const length = infos.length;
  const { onTouchStart, onTouchEnd } = useTouchScroll(close);
  const { onMouseDown, onMouseUp } = useMouseDrag(close);

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
        <MobileModalLayout>
          <ModalArticle
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <ArrowWrapper>
              <StyledBackArrow
                size={"40px"}
                onClick={prevSlider}
                current={current}
                length={length}
              />
            </ArrowWrapper>
            <ArrowWrapper>
              <StyledForwardArrow
                size={"40px"}
                onClick={nextSlider}
                current={current}
                length={length}
              />
            </ArrowWrapper>

            <Main>
              <MobileSlideBarWrapper>
                <MobileSlideBar />
              </MobileSlideBarWrapper>
              <CloseBtn onClick={close}>
                <StyledClose />
              </CloseBtn>
              <MobileRowColLayout>
                <ImgSlider datas={info.imgSrcs} />
                <ModalDescriptionSection article={info} titles={titles} />
              </MobileRowColLayout>
            </Main>
            <IndexContainer>
              <IndexSpan>{current + 1 + " / " + length}</IndexSpan>
            </IndexContainer>
          </ModalArticle>
        </MobileModalLayout>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default PhotoModal;
