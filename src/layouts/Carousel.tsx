import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useWindowResize } from "../Hooks/useWindowResize";

import { StyledBackArrow, StyledForwardArrow } from "./Arrow";

type CarouselProps = {
  datas: string[];
};

const Window = styled.div`
  height: 20vmax;

  overflow: hidden;
  position: relative;
`;

const CarouselWrapper = styled.div`
  display: inline-flex;
  padding: 1rem 0;
  height: inherit;
`;

const ScrollWrapper = styled.div`
  height: inherit;
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
`;

const ImgWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
`;

const Img = styled.img`
  width: 20vw;
  height: 100%;
  object-fit: contain;
  flex: none;

  transform: scale3d(1, 1, 1);
  transition: transform 0.5s;

  @media (min-width: 540px) {
    &:hover {
      transform: scale3d(1.2, 1.2, 1.2);
      transition: transform 0.5s;
    }
  }
`;

function Carousel({ datas }: CarouselProps) {
  const [page, setPage] = useState<number>(0);

  const [scrollContainer, setScrollContainer] = useState<
    HTMLElement | undefined
  >();
  const [carouselEl, setCarouselEl] = useState<HTMLElement | undefined>();
  const [leftArrow, setLeftArrow] = useState<HTMLElement | undefined>();
  const [rightArrow, setRightArrow] = useState<HTMLElement | undefined>();

  const TargetContanier = useRef<HTMLDivElement | null>(null);
  const containerWidth = useWindowResize(scrollContainer);

  useEffect(() => {
    setLeftArrow(document.getElementById("leftArrow") as HTMLElement);
    setRightArrow(document.getElementById("rightArrow") as HTMLElement);
    setScrollContainer(document.getElementById("scroll") as HTMLElement);
    setCarouselEl(document.getElementById("carousel") as HTMLElement);

    if (!leftArrow || !rightArrow || !scrollContainer || !carouselEl) {
      // console.error("dom id isnt exist");
    } else {
      const carouselElWidth = carouselEl.clientWidth;
      const scrollDistance = scrollContainer.clientWidth;

      scrollContainer.addEventListener("scroll", () => {
        if (scrollContainer.scrollLeft === 0) {
          setPage(0);
        } else if (
          scrollContainer.scrollLeft > 0 &&
          scrollDistance < carouselElWidth - scrollContainer.scrollLeft - 1
        ) {
          setPage(1);
        } else if (
          scrollDistance >=
          carouselElWidth - scrollContainer.scrollLeft - 1
        ) {
          setPage(datas.length);
        }
      });

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
  }, [scrollContainer, leftArrow, rightArrow, containerWidth]);

  if (datas.length === 0) return null;

  return (
    <Window>
      <StyledBackArrow
        id="leftArrow"
        current={page}
        length={datas.length}
        size={"3rem"}
        isBackGround={true}
        isMobileVisible={false}
      />
      <StyledForwardArrow
        id="rightArrow"
        current={page}
        length={datas.length}
        size={"3rem"}
        isBackGround={true}
        isMobileVisible={false}
      />
      <ScrollWrapper id={"scroll"} ref={TargetContanier}>
        <CarouselWrapper id={"carousel"}>
          {datas.map((img, index) => (
            <CarouselItem
              id={"carousel-item" + index}
              key={"CarouselItem" + index}
            >
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
