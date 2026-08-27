import { useEffect, useRef, useState } from "react";

import DetailImageModal from "@/components/common/Modals/DetailImageModal/DetailImageModal";
import { StyledBackArrow, StyledForwardArrow } from "./Arrow";

type CarouselProps = {
  datas: string[];
};

const Carousel = ({ datas }: CarouselProps) => {
  const [page, setPage] = useState<number>(0);

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

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isLeft = page === 0;
  const isRight = page === datas.length;

  // 화살표 클릭 — 보이는 폭만큼 좌/우로 스크롤한다.
  const scrollByPage = (direction: -1 | 1) => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    scroll.scrollBy({
      top: 0,
      left: direction * scroll.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const scroll = scrollRef.current;
    const carousel = carouselRef.current;
    if (!scroll || !carousel) return;

    // 폭은 스크롤할 때마다 다시 읽는다(리사이즈 후에도 페이지 계산이 맞도록).
    const handleScroll = () => {
      const carouselWidth = carousel.clientWidth;
      const scrollDistance = scroll.clientWidth;

      if (scroll.scrollLeft === 0) {
        setPage(0);
        return;
      }
      if (
        scroll.scrollLeft > 0 &&
        scrollDistance < carouselWidth - scroll.scrollLeft - 1
      ) {
        setPage(1);
        return;
      }
      if (scrollDistance >= carouselWidth - scroll.scrollLeft - 1) {
        setPage(datas.length);
      }
    };

    scroll.addEventListener("scroll", handleScroll);
    return () => scroll.removeEventListener("scroll", handleScroll);
  }, [datas.length]);

  if (datas.length === 0) return null;

  return (
    <div className="h-60 box-border mb-6 overflow-hidden relative">
      <StyledBackArrow
        onClick={() => scrollByPage(-1)}
        current={page}
        length={datas.length}
        size={"3rem"}
        $isBackGround={true}
        $isMobileVisible={false}
      />
      <StyledForwardArrow
        onClick={() => scrollByPage(1)}
        current={page}
        length={datas.length}
        size={"3rem"}
        $isBackGround={true}
        $isMobileVisible={false}
      />
      <div
        id="scroll"
        ref={scrollRef}
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
        <div ref={carouselRef} className="inline-flex h-full py-3">
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
