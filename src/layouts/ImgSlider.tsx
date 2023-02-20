import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { StyledBackArrow, StyledForwardArrow } from "./Arrow";

type ImgSliderProps = {
  datas: string[]; // imgSrcs: string[]
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
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.greyColor};
  opacity: 0.3;

  margin: 0 4px;

  &.active {
    background-color: ${(props) => props.theme.bgColor};
    width: 5px;
    height: 5px;
    opacity: 1;
  }
`;

function ImgSlider({ datas }: ImgSliderProps) {
  const [current, setCurrent] = useState<number>(0);
  const length = datas.length;

  useEffect(() => {
    setCurrent(0);
  }, [datas]);

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
              // TODO dev Api
              src={require("../assets/images/trainingLog/" + slider)}
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
