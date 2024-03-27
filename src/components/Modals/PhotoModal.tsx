import { useCallback, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { StyledBackArrow, StyledForwardArrow } from "../../layouts/Arrow";
import { ArticleInfoType } from "../../types/ArticleInfoType";

import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import useBodyScrollLock from "../../Hooks/useBodyScrollLock";
import { ReactComponent as Close } from "../../assets/svgs/close.svg";
import ModalArticleContainer from "./ModalArticleContainer";
import Loading from "../Skeletons/Loading";

type PhotoModalProps = {
  baseurl: string;
  open: boolean;
  close: (event?: MouseEvent) => void;
  infos: ArticleInfoType[];
  id: string;
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

// TODO:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SlideUp = keyframes`
  from {
    transform: translateY(-10.0rem);
  }
  to {
    transform: translateY(0px);
  }
  `;

// TODO:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  z-index: 1;
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

  @media (max-width: 539px) {
    display: none;
  }
`;

const MobileModalLayout = styled.div`
  position: relative;
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
  z-index: 1;
  top: 1rem;
  right: 1rem;
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

const PhotoModal = ({ baseurl, open, close, infos, id, titles }: PhotoModalProps) => {
  const navigate = useNavigate();

  const { lockScroll, openScroll } = useBodyScrollLock();

  const current = infos.findIndex((infoItem) => infoItem.id.toString() === id.toString());

  const nextSlider = useCallback(() => {
    navigate(`/${baseurl}/${infos[current + 1].id}`, { replace: true });
  }, [baseurl, current, infos, navigate]);

  const prevSlider = useCallback(() => {
    navigate(`/${baseurl}/${infos[current - 1].id}`, { replace: true });
  }, [baseurl, current, infos, navigate]);

  const info = infos.find((infoItem) => infoItem.id.toString() === id.toString());

  const length = infos.length;

  useEffect(() => {
    if (open) {
      lockScroll();
    } else {
      openScroll();
    }
    return () => {
      openScroll();
    };
  }, []);
  if (!info) {
    openScroll();
    return <Loading />;
  }

  return createPortal(
    <Container className={open ? "openModal" : "closeModal"}>
      <ArrowWrapper isMobileVisible={false} isDesktopVisible={true}>
        <StyledBackArrow size={"4rem"} onClick={prevSlider} current={current} length={length} />
        <StyledForwardArrow size={"4rem"} onClick={nextSlider} current={current} length={length} />
      </ArrowWrapper>
      <MobileModalLayout>
        <CloseBtn
          onClick={() => {
            openScroll();
            close();
          }}
        >
          <StyledClose />
        </CloseBtn>
        <ModalArticleContainer info={info} titles={titles} />
        <IndexContainer>
          <ArrowWrapper isMobileVisible={true} isDesktopVisible={false}>
            <StyledBackArrow size={"4rem"} onClick={prevSlider} current={current} length={length} isMobileVisible={true} />
            <StyledForwardArrow size={"4rem"} onClick={nextSlider} current={current} length={length} isMobileVisible={true} />
          </ArrowWrapper>
          <IndexSpan>{current + 1 + " / " + length}</IndexSpan>
        </IndexContainer>
      </MobileModalLayout>
    </Container>,
    document.body
  );
};

export default PhotoModal;
