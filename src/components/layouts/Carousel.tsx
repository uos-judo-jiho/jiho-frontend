import { useEffect, useRef, useState } from "react";

import DetailImageModal from "@/components/common/Modals/DetailImageModal/DetailImageModal";
import { StyledBackArrow, StyledForwardArrow } from "./Arrow";

type CarouselProps = {
  datas: string[];
};

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
    <div className="h-60 box-border mb-6 overflow-hidden relative">
      <StyledBackArrow
        id="leftArrow"
        current={page}
        length={datas.length}
        size={"3rem"}
        $isBackGround={true}
        $isMobileVisible={false}
      />
      <StyledForwardArrow
        id="rightArrow"
        current={page}
        length={datas.length}
        size={"3rem"}
        $isBackGround={true}
        $isMobileVisible={false}
      />
      <div
        id="scroll"
        ref={targetContanier}
        className="relative h-full overflow-x-scroll whitespace-nowrap scroll-smooth"
        style={{
          overscrollBehaviorX: "contain",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>{`
          #scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div id="carousel" className="inline-flex h-full py-3">
          {datas.map((img, index) => (
            <div
              key={img}
              onClick={() => handleItemClick(img)}
              className="inline-block bg-black transition-all duration-500 rounded mr-3 cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="w-full h-full rounded flex items-center justify-center overflow-hidden">
                <img
                  src={img}
                  alt={`갤러리 이미지 ${index + 1}`}
                  className="min-w-[216px] aspect-square h-full object-contain flex-none transform scale-100 transition-transform duration-500 sm:hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <DetailImageModal
        image={selectedDetailImage}
        title={`갤러리 이미지 ${datas.indexOf(selectedDetailImage) + 1}`}
        isOpen={detailIsOpen}
        onClose={handleDetailClose}
      />
      {!isLeft && (
        <div
          className="absolute top-3 bottom-0 w-8 left-0 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          style={{
            height: "calc(240px - 24px)",
            background:
              "linear-gradient(0.75turn, rgba(33, 33, 33, 0), rgb(33, 33, 33))",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />
      )}
      {!isRight && (
        <div
          className="absolute top-3 bottom-0 w-8 right-0 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          style={{
            height: "calc(240px - 24px)",
            background:
              "linear-gradient(0.25turn, rgba(33, 33, 33, 0), rgb(33, 33, 33))",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />
      )}
    </div>
  );
};

export default Carousel;
