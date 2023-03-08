import { useEffect, useState } from "react";
import styled from "styled-components";

import { StyledBackArrow, StyledForwardArrow } from "./Arrow";
// TODO 스크롤 위치 값 가져와서 화살표 사라지게 하기

type CarouselProps = {
  datas: string[];
};

const Window = styled.div`
  height: 30%;

  overflow: hidden;
  position: relative;
`;

const CarouselWrapper = styled.div`
  display: inline-flex;
  padding: 1rem 0;
`;

const ScrollWrapper = styled.div`
  overflow-x: scroll;

  overscroll-behavior-x: contain;
  scroll-behavior: smooth;

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
  border-radius: 0.5rem;
  margin-right: 1rem;

  cursor: pointer;

  /* &:hover {
    transform: scale3d(1.01, 1.01, 1.01);
    box-shadow: 2px 4px 16px rgb(0 0 0 / 16%);
  } */
`;

const ImgWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
`;

const Img = styled.img`
  width: 20vw;
  height: 20vw;
  object-fit: contain;
  flex: none;

  transform: scale3d(1, 1, 1);
  transition: transform 0.5s;

  &:hover {
    transform: scale3d(1.2, 1.2, 1.2);
    transition: transform 0.5s;

    /* box-shadow: 2px 4px 16px rgb(0 0 0 / 16%); */
  }
`;

function Carousel({ datas }: CarouselProps) {
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [scrollContainer, setScrollContainer] = useState<
    HTMLElement | undefined
  >();
  const [leftArrow, setLeftArrow] = useState<HTMLElement | undefined>();
  const [rightArrow, setRightArrow] = useState<HTMLElement | undefined>();

  useEffect(() => {
    setLeftArrow(document.getElementById("leftArrow") as HTMLElement);
    setRightArrow(document.getElementById("rightArrow") as HTMLElement);
    setScrollContainer(document.getElementById("scroll") as HTMLElement);
    if (!leftArrow || !rightArrow || !scrollContainer) {
      console.error("dom id isnt exist");
    } else {
      const scrollContainerWidth = scrollContainer.clientWidth;
      const scrollDistance = scrollContainerWidth / 2;

      setScrollContainerWidth(scrollContainerWidth);
      setScrollDistance(scrollDistance);
      setScrollContainer(scrollContainer);

      leftArrow.onclick = function () {
        scrollContainer.scrollBy({
          top: 0,
          left: -scrollDistance,
          behavior: "smooth",
        });
      };
      rightArrow.onclick = function () {
        scrollContainer.scrollBy({
          top: 0,
          left: +scrollDistance,
          behavior: "smooth",
        });
      };
    }
  }, [scrollContainer, leftArrow, rightArrow]);

  return (
    <Window>
      <StyledBackArrow
        id="leftArrow"
        current={1}
        length={datas.length}
        size={"3rem"}
        isBackGround={true}
        isMobileVisible={false}
      />
      <StyledForwardArrow
        id="rightArrow"
        current={1}
        length={datas.length}
        size={"3rem"}
        isBackGround={true}
        isMobileVisible={false}
      />
      <ScrollWrapper id={"scroll"}>
        <CarouselWrapper id={"carousel"}>
          {datas.map((img, index) => (
            <CarouselItem id={"carousel-item"} key={"CarouselItem" + index}>
              <ImgWrapper>
                <Img src={img} />
              </ImgWrapper>
            </CarouselItem>
          ))}
        </CarouselWrapper>
      </ScrollWrapper>
    </Window>
  );
}

export default Carousel;
