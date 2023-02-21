import React, { useEffect, useState, useTransition } from "react";
import styled, { keyframes } from "styled-components";
import demoImg from "../assets/images/demo.jpg";
import demoImg1 from "../assets/images/demo1.jpg";
import demoImg2 from "../assets/images/demo2.jpg";
import demoImg3 from "../assets/images/demo3.jpg";
import demoImg4 from "../assets/images/demo4.jpg";
import { StyledBackArrow, StyledForwardArrow } from "./Arrow";

type CarouselAnimationProps = {
  x: number;
};

const BackAnimation = (x: number) => keyframes`
    from {
        transform: translateX(${x}px);
    }
    to {
        transform: translateX((calc(${x} + 20)px));
    }
`;

const ForwardAnimation = (x: number) => keyframes`
    from {
      transform: translateX(${x}px);
    }
    to {
      transform: translateX(calc(${x}px -10%));
    }
`;
const Window = styled.div`
  background: coral;
  height: 30%;
  overflow: hidden;
`;

const CarouselWrapper = styled.div<CarouselAnimationProps>`
  display: inline-flex;

  &.forward {
    animation: ${(props) => ForwardAnimation(props.x)} 0.5s forwards;
  }
  &.back {
    animation: ${(props) => BackAnimation(props.x)} 0.5s forwards;
  }
`;

const ScrollWrapper = styled.div`
  overflow-x: scroll;

  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }

  /* &.data-core-scroller { */
  position: relative;
  white-space: nowrap;
  scroll-snap-type: mandatory;
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  /* } */
`;

const ImgWrapper = styled.div`
  background: black;
  margin-right: 1rem;
  border-radius: 0.5rem;
  scroll-snap-align: start;
  display: inline-block;
`;

const Img = styled.img`
  width: 20vw;
  height: 20vw;
  object-fit: contain;
  flex: none;
`;

function Carousel() {
  const demoImgArray = [demoImg, demoImg1, demoImg2, demoImg3, demoImg4];
  const [direction, setDirection] = useState("");
  const [currentTranslateX, setCurrentTranslateX] = useState(0);

  useEffect(() => {
    const carousel = document.getElementById("carousel") as HTMLElement;
    const scroll = document.getElementById("scroll") as HTMLElement;

    function _setCurrentTranslateX() {
      setCurrentTranslateX(
        carousel.getBoundingClientRect().left -
          scroll.getBoundingClientRect().left
      );
    }
    function wacthScroll() {
      scroll.addEventListener("scroll", _setCurrentTranslateX);
    }
    wacthScroll();
  });

  function handleBackArrow() {
    setDirection("back");
  }

  function handleForwardArrow() {
    setDirection("forward");
    setTimeout(() => {
      handleAnimationEnd();
    }, 500);
  }

  function handleAnimationEnd() {
    // setDirection("");
  }

  return (
    <Window>
      <StyledBackArrow
        current={1}
        length={demoImgArray.length}
        onClick={handleBackArrow}
        onAnimationEnd={handleAnimationEnd}
      />
      <StyledForwardArrow
        current={1}
        length={demoImgArray.length}
        onClick={handleForwardArrow}
        onAnimationEnd={handleAnimationEnd}
      />
      <ScrollWrapper id={"scroll"}>
        <CarouselWrapper
          id={"carousel"}
          className={direction}
          x={currentTranslateX}
        >
          {demoImgArray.map((img, index) => (
            <ImgWrapper key={"demo" + index}>
              <Img src={img} />
            </ImgWrapper>
          ))}
        </CarouselWrapper>
      </ScrollWrapper>
      {currentTranslateX}
    </Window>
  );
}

export default Carousel;
