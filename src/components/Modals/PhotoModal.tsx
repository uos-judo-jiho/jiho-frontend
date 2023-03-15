import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { StyledBackArrow, StyledForwardArrow } from "../../layouts/Arrow";
import { ArticleInfoType } from "../../types/ArticleInfoType";

import { ReactComponent as Close } from "../../assets/svgs/close.svg";
import ModalArticleContainer from "./ModalArticleContainer";

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
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 5%;
  padding-top: 1rem;
  color: ${(props) => props.theme.lightGreyColor};

  @media (max-width: 539px) {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.blackColor};
  }
`;
const IndexSpan = styled.span`
  font-size: ${(props) => props.theme.defaultFontSize};
  display: block;
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
  }
`;

const MobileModalLayout = styled.div`
  @media (max-width: 539px) {
    width: 100%;
    height: 100%;
    padding-top: 10rem;
  }
`;

const StyledClose = styled(Close)``;

type ArrowWrapperProps = {
  isMobileVisible: boolean;
  isDesktopVisible: boolean;
};

const ArrowWrapper = styled.div<ArrowWrapperProps>`
  display: ${(props) => (props.isDesktopVisible ? "flex" : "none")};
  @media (max-width: 539px) {
    display: ${(props) => (props.isMobileVisible ? "flex" : "none")};
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
    top: 7rem;
    right: 1rem;

    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-name: ${FadeIn};
    animation-fill-mode: forwards;
  }
`;

function PhotoModal({ open, close, infos, index, titles }: PhotoModalProps) {
  const [animate, setAnimate] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(open);
  const [current, setCurrent] = useState<number>(index);
  const [info, setInfo] = useState<ArticleInfoType>(infos[index]);
  const [length, setLength] = useState<number>(0);

  // const { onTouchStart, onTouchEnd } = useTouchScroll(close);
  // const { onMouseDown, onMouseUp } = useMouseDrag(close);

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
        <ArrowWrapper isMobileVisible={false} isDesktopVisible={true}>
          <StyledBackArrow
            size={"4rem"}
            onClick={prevSlider}
            current={current}
            length={length}
          />
          <StyledForwardArrow
            size={"4rem"}
            onClick={nextSlider}
            current={current}
            length={length}
          />
        </ArrowWrapper>
        <ModalArticleContainer info={info} titles={titles} />
        <IndexContainer>
          <ArrowWrapper isMobileVisible={true} isDesktopVisible={false}>
            <StyledBackArrow
              size={"4rem"}
              onClick={prevSlider}
              current={current}
              length={length}
              isMobileVisible={true}
            />
            <StyledForwardArrow
              size={"4rem"}
              onClick={nextSlider}
              current={current}
              length={length}
              isMobileVisible={true}
            />
          </ArrowWrapper>
          <IndexSpan>{current + 1 + " / " + length}</IndexSpan>
        </IndexContainer>
      </MobileModalLayout>
    </Container>
  );
}

export default PhotoModal;
