import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { ReactComponent as BackArrow } from "../assets/svgs/arrow_back_ios.svg";
import { ReactComponent as ForwardArrow } from "../assets/svgs/arrow_forward_ios.svg";

type ImgSliderProps = {
  datas: Object[];
};

type ArrowProps = {
  current: number;
  length: number;
};

const SliderAnimation = keyframes`
    from {
        opacity: 0.9;
    }
    to {
        opacity: 1;
    }
`;

const Thumbnail = styled.img`
  width: 30vw;
  height: 30vw;
  object-fit: cover;

  display: none;

  &.active {
    display: flex;
    animation: ${SliderAnimation} 0.8s;
  }
`;

const Slider = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImgSliderWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ArrowCss = css`
  position: absolute;
  z-index: 10;
  user-select: none;

  cursor: pointer;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const StyledBackArrow = styled(BackArrow)<ArrowProps>`
  display: ${(props) => (props.current === 0 ? "none" : "flex")};
  top: 50%;
  left: 12px;
  ${ArrowCss}
`;

const StyledForwardArrow = styled(ForwardArrow)<ArrowProps>`
  display: ${(props) => (props.current < props.length - 1 ? "flex" : "none")};
  top: 50%;
  right: 12px;
  ${ArrowCss}
`;

const CircleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 12px;
  right: 0;
  left: 0;
`;

const CurrentCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.greyColor};
  opacity: 0.3;

  /* &:not(:last-child) { */
  margin: 0 10px;
  /* } */
  &.active {
    background-color: ${(props) => props.theme.bgColor};
    width: 12px;
    height: 12px;
    opacity: 1;
  }
`;

function ImgSlider({ datas }: ImgSliderProps) {
  const [current, setCurrent] = useState<number>(0);
  const length = datas.length;
  console.log(length, current);
  function nextSlider() {
    setCurrent(current + 1);
  }

  function prevSlider() {
    setCurrent(current - 1);
  }

  if (!Array.isArray(datas) || datas.length <= 0) {
    return null;
  }

  return (
    <Slider>
      <ImgSliderWrapper>
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

        {datas.map((slider, index) => {
          return (
            <Thumbnail
              src={slider.toString()}
              key={"thumbnail" + index}
              className={index === current ? "active" : ""}
            />
          );
        })}
        <CircleWrapper>
          {datas.map((slider, index) => {
            return (
              <CurrentCircle
                key={"circle" + index}
                className={index === current ? "active" : ""}
              />
            );
          })}
        </CircleWrapper>
      </ImgSliderWrapper>
    </Slider>
  );
}

export default ImgSlider;
