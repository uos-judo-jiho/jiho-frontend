import React, { useEffect, useState, useRef } from "react";

import styled from "styled-components";
import { Constants } from "../constant/constant";
import { useTouchScroll } from "../Hooks/useTouchScroll";
import { StyledBackArrow, StyledForwardArrow } from "./Arrow";

// TODO 페이지 넘길 때 사진이 흘러가는 에니메이션 막기

type SliderProps = {
  datas: string[];
};
type IMGProps = {
  isImage?: boolean;
};
const IMG = styled.img<IMGProps>`
  width: 30vw;
  height: 30vw;

  min-height: 30rem;
  min-width: 100%;

  object-fit: contain;
  background-color: ${(props) =>
    props.isImage ? props.theme.blackColor : props.theme.bgColor};

  @media (max-width: 539px) {
    width: 100%;
  }
`;

const Container = styled.section`
  position: relative;
  overflow: hidden;
  display: flex;
  width: 50vw;
  justify-content: center;
  align-items: center;
  @media (max-width: 539px) {
    width: 100%;
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
`;

const SliderWrapper = styled.div`
  width: 100%;
  display: block;
`;

const CircleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(0, -2rem);
  /* position: absolute;
  bottom: 1.2rem;
  right: 0;
  left: 0;*/
`;

const CurrentCircle = styled.div`
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.lightGreyColor};
  opacity: 0.3;

  margin: 0 4px;

  &.active {
    background-color: ${(props) => props.theme.bgColor};
    width: 0.5rem;
    height: 0.5rem;
    opacity: 1;
  }
`;

function Slider({ datas }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [length, setLength] = useState<number>(0);

  const slideRef = useRef<any>(null);

  function nextSlide() {
    setCurrentSlide((prev) => {
      if (prev === length - 1) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  }

  function prevSlide() {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        return prev;
      } else {
        return prev - 1;
      }
    });
  }

  const { onTouchStart, onTouchEnd } = useTouchScroll([nextSlide, prevSlide]);

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transition = "all 0.5s ease-in-out";
      slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
    }
  }, [currentSlide]);

  useEffect(() => {
    setCurrentSlide(0);
    setLength(datas.length);
  }, [datas]);

  if (!Array.isArray(datas) || datas.length <= 0) {
    console.error("Image가 존재하지 않습니다.");

    return null;
  }
  return (
    <Container>
      <StyledBackArrow
        onClick={prevSlide}
        current={currentSlide}
        length={length}
        isBackGround={true}
        isMobileVisible={true}
      />
      <StyledForwardArrow
        onClick={nextSlide}
        current={currentSlide}
        length={length}
        isBackGround={true}
        isMobileVisible={true}
      />
      <SliderWrapper>
        <SliderContainer
          ref={slideRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {datas.map((img, i) => (
            <IMG
              src={img ? img : Constants.LOGO_BLACK}
              key={"thumbnail" + i}
              isImage={img ? true : false}
            />
          ))}
        </SliderContainer>
        <CircleWrapper>
          {datas.length === 1
            ? null
            : datas.map((image, index) => {
                return (
                  <CurrentCircle
                    key={"circle" + index}
                    className={index === currentSlide ? "active" : ""}
                  />
                );
              })}
        </CircleWrapper>
      </SliderWrapper>
    </Container>
  );
}

export default Slider;