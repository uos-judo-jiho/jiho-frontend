import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Constants } from "../constant";
import useTouchScroll from "../Hooks/useTouchScroll";
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

type ThumbnailProps = {
  isImage?: boolean;
};

const Thumbnail = styled.img<ThumbnailProps>`
  width: 30vw;
  height: 30vw;
  object-fit: contain;
  background-color: ${(props) => (props.isImage ? props.theme.blackColor : props.theme.bgColor)};

  min-width: 30rem;
  min-height: 30rem;

  display: none;

  &.active {
    display: flex;
    animation: ${SliderAnimation} 0.8s;
  }
  @media (max-width: 539px) {
    width: 100%;
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
  transform: translate(0, -12px);
`;

const CurrentCircle = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.lightGreyColor};
  opacity: 0.3;

  margin: 0 4px;

  &.active {
    background-color: ${(props) => props.theme.bgColor};
    width: 6px;
    height: 6px;
    opacity: 1;
  }
`;

function ImgSlider({ datas }: ImgSliderProps) {
  const [current, setCurrent] = useState<number>(0);
  const [length, setLength] = useState<number>(0);

  const { onTouchStart, onTouchEnd } = useTouchScroll([nextSlider, prevSlider]);

  useEffect(() => {
    setCurrent(0);
    setLength(datas.length);
  }, [datas]);

  function nextSlider() {
    setCurrent((prev) => {
      if (prev === length - 1) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  }

  function prevSlider() {
    setCurrent((prev) => {
      if (prev === 0) {
        return prev;
      } else {
        return prev - 1;
      }
    });
  }

  if (!Array.isArray(datas) || datas.length <= 0) {
    console.error("Image가 존재하지 않습니다.");

    return null;
  }

  return (
    <Slider>
      <ImgSliderWrapper onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <StyledBackArrow onClick={prevSlider} current={current} length={length} isBackGround={true} isMobileVisible={true} />
        <StyledForwardArrow onClick={nextSlider} current={current} length={length} isBackGround={true} isMobileVisible={true} />
        {datas.map((image, index) => {
          return <Thumbnail isImage={image ? true : false} src={image ? image : Constants.LOGO_BLACK} key={"thumbnail" + index} className={index === current ? "active" : ""} />;
        })}

        <CircleWrapper>
          {datas.length === 1
            ? null
            : datas.map((image, index) => {
                return <CurrentCircle key={"circle" + index} className={index === current ? "active" : ""} />;
              })}
        </CircleWrapper>
      </ImgSliderWrapper>
    </Slider>
  );
}

export default ImgSlider;
