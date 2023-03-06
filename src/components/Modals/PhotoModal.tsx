import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { useMouseDrag } from "../../Hooks/useMouseDrag";
import { useTouchScroll } from "../../Hooks/useTouchScroll";
import { StyledBackArrow, StyledForwardArrow } from "../../layouts/Arrow";
import ImgSlider from "../../layouts/ImgSlider";
import MobileRowColLayout from "../../layouts/MobileRowColLayout";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import ModalDescriptionSection from "./ModalDescriptionSection";

import { ReactComponent as Close } from "../../assets/svgs/close.svg";

type PhotoModalProps = {
  open: boolean;
  close: React.MouseEventHandler<HTMLButtonElement>;
  infos: ArticleInfoType[];
  index: number;
  titles: string[];
};

const FadeOut = keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
`;

const FadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`;

const SlideUp = keyframes`
  from {
    transform: translateY(-100px);
  }
  to {
    transform: translateY(0px);
  }
`;

const SlideDown = keyframes`  
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-100px);
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
  font-size: ${(props) => props.theme.defaultFontSize};
  display: block;
  color: ${(props) => props.theme.lightGreyColor};
  @media (max-width: 539px) {
    display: none;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);

  animation-duration: 0.25s;
  animation-name: ${FadeIn};
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;

  display: flex;
  justify-content: center;
  align-items: center;

  &.closeModal {
    animation-name: ${FadeOut};
    & > article {
      animation-name: ${SlideDown};
    }
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
  width: 80vw;
  height: 80vh;
  margin: auto;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.bgColor};
  overflow: auto;

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${SlideUp};
  animation-fill-mode: forwards;

  overflow: hidden;
  isolation: isolate;

  @media (max-width: 539px) {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem 0.5rem 0 0;
    overflow: scroll;
    isolation: auto;
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
  top: 12%;
  right: 12%;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  @media (max-width: 539px) {
    position: absolute;
    top: 10%;
    right: 1rem;

    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-name: ${FadeIn};
    animation-fill-mode: forwards;
  }
`;

const Main = styled.main`
  position: relative;
  padding: 1rem;
  width: 100%;
  height: 100%;
`;

function PhotoModal({ open, close, infos, index, titles }: PhotoModalProps) {
  const [animate, setAnimate] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(open);
  const [current, setCurrent] = useState<number>(index);
  const [info, setInfo] = useState<ArticleInfoType>(infos[index]);
  const [length, setLength] = useState<number>(0);

  const { onTouchStart, onTouchEnd } = useTouchScroll(close);
  const { onMouseDown, onMouseUp } = useMouseDrag(close);

  useEffect(() => {
    const infosLength = infos.length;
    setLength(infosLength);
  }, []);

  useEffect(() => {
    setInfo(infos[current]);
  }, [current]);

  useEffect(() => {
    if (visible && !open) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 250);
    }
    setAnimate(open);
  }, [visible, open]);

  function nextSlider() {
    setCurrent(current + 1);
  }

  function prevSlider() {
    setCurrent(current - 1);
  }

  if (!animate && !visible) return null;

  return (
    <Container className={open ? "openModal" : "closeModal"}>
      <MobileModalLayout>
        <CloseBtn onClick={close}>
          <StyledClose />
        </CloseBtn>
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
        <ModalArticle
        // onTouchStart={onTouchStart}
        // onTouchEnd={onTouchEnd}
        // onMouseDown={onMouseDown}
        // onMouseUp={onMouseUp}
        >
          <Main>
            {/* 모바일 환경에서 드래그로 모달 닫는 액션 */}
            {/* <MobileSlideBarWrapper>
              <MobileSlideBar />
            </MobileSlideBarWrapper> */}
            {/* <CloseBtn onClick={close}>
              <StyledClose />
            </CloseBtn> */}
            <MobileRowColLayout>
              <ImgSlider datas={info.imgSrcs} />
              <ModalDescriptionSection article={info} titles={titles} />
            </MobileRowColLayout>
          </Main>
        </ModalArticle>
        <IndexContainer>
          <IndexSpan>{current + 1 + " / " + length}</IndexSpan>
        </IndexContainer>
      </MobileModalLayout>
    </Container>
  );
}

export default PhotoModal;
