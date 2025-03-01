import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import DetailImageModal from "../components/Modals/DetailImageModal/DetailImageModal";
import { StyledBackArrow, StyledForwardArrow } from "./Arrow";

type CarouselProps = {
  datas: string[];
};

const Window = styled.div`
  height: 240px;
  box-sizing: border-box;

  margin-bottom: 24px;

  overflow: hidden;
  position: relative;

  & .filter {
    position: absolute;

    &.right,
    &.left {
      top: 12px;
      bottom: 0;

      width: 32px;
      height: calc(240px - 12 * 2px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }

    &.right {
      background: linear-gradient(
        0.25turn,
        rgba(33, 33, 33, 0),
        rgb(33, 33, 33)
      );
      right: 0;
    }

    &.left {
      background: linear-gradient(
        0.75turn,
        rgba(33, 33, 33, 0),
        rgb(33, 33, 33)
      );
      left: 0;
    }
  }
`;

const CarouselWrapper = styled.div`
  display: inline-flex;
  height: inherit;

  padding: 12px 0;
`;

const ScrollWrapper = styled.div`
  position: relative;

  height: inherit;
  overflow-x: scroll;

  white-space: nowrap;

  overscroll-behavior-x: contain;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
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
  border-radius: 4px;
  margin-right: 12px;

  cursor: pointer;
`;

const ImgWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
`;

const Img = styled.img`
  min-width: 216px;
  aspect-ratio: 1 / 1;
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

const Carousel = ({ datas }: CarouselProps) => {
  const [page, setPage] = useState<number>(0);

  const [scrollContainer, setScrollContainer] = useState<
    HTMLElement | undefined
  >();
  const [carouselEl, setCarouselEl] = useState<HTMLElement | undefined>();
  const [leftArrow, setLeftArrow] = useState<HTMLElement | undefined>();
  const [rightArrow, setRightArrow] = useState<HTMLElement | undefined>();
  const [detailIsOpen, setDetailIsOpen] = useState(false);
  const [selectedDetailImage, setSelectedDetailImage] = useState("");

  const handleItemClick = (image: string) => {
    setSelectedDetailImage(image);
    setDetailIsOpen(true);
  };

  const handleDetailClose = () => {
    setSelectedDetailImage("");
    setDetailIsOpen(false);
  };

  const targetContanier = useRef<HTMLDivElement | null>(null);
  const isLeft = page === 0;
  const isRight = page === datas.length;

  useEffect(() => {
    setLeftArrow(document.getElementById("leftArrow") as HTMLElement);
    setRightArrow(document.getElementById("rightArrow") as HTMLElement);
    setScrollContainer(document.getElementById("scroll") as HTMLElement);
    setCarouselEl(document.getElementById("carousel") as HTMLElement);

    if (!leftArrow || !rightArrow || !scrollContainer || !carouselEl) {
      return;
    }
    const carouselElWidth = carouselEl.clientWidth;
    const scrollDistance = scrollContainer.clientWidth;

    scrollContainer.addEventListener("scroll", () => {
      if (scrollContainer.scrollLeft === 0) {
        setPage(0);
        return;
      }
      if (
        scrollContainer.scrollLeft > 0 &&
        scrollDistance < carouselElWidth - scrollContainer.scrollLeft - 1
      ) {
        setPage(1);
        return;
      }
      if (scrollDistance >= carouselElWidth - scrollContainer.scrollLeft - 1) {
        setPage(datas.length);
        return;
      }
    });

    leftArrow.onclick = () => {
      scrollContainer.scrollBy({
        top: 0,
        left: -scrollDistance,
        behavior: "smooth",
      });
    };
    rightArrow.onclick = () => {
      scrollContainer.scrollBy({
        top: 0,
        left: +scrollDistance,
        behavior: "smooth",
      });
    };
  }, [carouselEl, datas.length, leftArrow, rightArrow, scrollContainer]);

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
      <ScrollWrapper id={"scroll"} ref={targetContanier}>
        <CarouselWrapper id={"carousel"}>
          {datas.map((img) => (
            <CarouselItem key={img} onClick={() => handleItemClick(img)}>
              <ImgWrapper>
                <Img src={img} />
              </ImgWrapper>
            </CarouselItem>
          ))}
        </CarouselWrapper>
      </ScrollWrapper>
      <DetailImageModal
        image={selectedDetailImage}
        isOpen={detailIsOpen}
        onClose={handleDetailClose}
      />
      <div className={`filter ${!isLeft ? "left" : ""}`} />
      <div className={`filter ${!isRight ? "right" : ""}`} />
    </Window>
  );
};

export default Carousel;
