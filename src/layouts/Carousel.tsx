import { useEffect, useState } from "react";
import styled from "styled-components";

import { StyledBackArrow, StyledForwardArrow } from "./Arrow";

type CarouselProps = {
  datas: string[];
};

// TODO 캐로셀 화살표 구현
type CarouselWrapperProps = {
  index: number;
};

const Window = styled.div`
  height: 30%;

  overflow: hidden;
  position: relative;
`;

const CarouselWrapper = styled.div<CarouselWrapperProps>`
  display: inline-flex;
  padding: 1rem 0;
`;

const ScrollWrapper = styled.div`
  overflow-x: scroll;

  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }

  position: relative;
  white-space: nowrap;
  // TODO snap은 컨테이너의 크기를 조절한 후 활성화
  /* scroll-snap-type: mandatory;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; */
`;

const CarouselItem = styled.div`
  scroll-snap-align: start;
  display: inline-block;
  background: black;
  transition: all 0.5s;
  border-radius: 1rem;
  margin-right: 1rem;

  cursor: pointer;

  &:hover {
    transform: scale3d(1.01, 1.01, 1.01);
    box-shadow: 2px 4px 16px rgb(0 0 0 / 16%);
  }
`;

const ImgWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Img = styled.img`
  width: 20vw;
  height: 20vw;
  object-fit: contain;
  flex: none;
`;

function Carousel({ datas }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const [carouselItemWidth, setCarouselItemWidth] = useState<number>(0);
  const [maxIndex, setMaxIndex] = useState<number>(0);

  useEffect(() => {
    const carouselDivWidth = document.getElementById("carousel")?.offsetWidth;
    const carouselItemDivWidth =
      document.getElementById("carousel-item")?.offsetWidth;

    setCarouselWidth(carouselDivWidth || 0);
    setCarouselItemWidth(carouselItemDivWidth || 0);
    setMaxIndex(
      Math.ceil((carouselDivWidth || 0) / (carouselItemDivWidth || 1))
    );
    console.log(carouselWidth, carouselItemWidth, maxIndex);
  }, [document.getElementById("carousel")]);

  function handleBackArrow() {
    if (currentIndex === 0) {
      return;
    }
    setCurrentIndex((prev) => prev - 1);
    console.log(CarouselWrapper);
  }

  function handleForwardArrow() {
    if (currentIndex === maxIndex) {
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  }

  return (
    <Window>
      <StyledBackArrow
        current={1}
        length={datas.length}
        onClick={handleBackArrow}
      />
      <StyledForwardArrow
        current={1}
        length={datas.length}
        onClick={handleForwardArrow}
      />
      <ScrollWrapper id={"scroll"}>
        <CarouselWrapper id={"carousel"} index={currentIndex}>
          {datas.map((img, index) => (
            <CarouselItem id={"carousel-item"} key={"demo" + index}>
              <ImgWrapper>
                <Img src={img} />
              </ImgWrapper>
            </CarouselItem>
          ))}
        </CarouselWrapper>
      </ScrollWrapper>
      {currentIndex}
    </Window>
  );
}

export default Carousel;
