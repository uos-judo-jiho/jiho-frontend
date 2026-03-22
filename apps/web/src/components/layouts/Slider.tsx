import { useEffect, useRef, useState } from "react";

import useTouchScroll from "@/shared/hooks/useTouchScroll";
import { Constants } from "@/shared/lib/constant";
import { cn } from "@/shared/lib/utils";
import { StyledBackArrow, StyledForwardArrow } from "./Arrow";

type SliderProps = {
  datas: string[];
};

function Slider({ datas }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showArrowsInitially, setShowArrowsInitially] = useState(true);
  const length = datas.length;

  const slideRef = useRef<HTMLDivElement>(null);

  function nextSlide() {
    setCurrentSlide((prev) => (prev === length - 1 ? prev : prev + 1));
  }

  function prevSlide() {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  }

  const { onTouchStart, onTouchEnd } = useTouchScroll([nextSlide, prevSlide]);

  useEffect(() => {
    setCurrentSlide(0);
    setShowArrowsInitially(true);
    const timer = setTimeout(() => {
      setShowArrowsInitially(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [datas]);

  if (!Array.isArray(datas) || datas.length <= 0) {
    console.error("Image가 존재하지 않습니다.");
    return null;
  }

  return (
    <section className="relative group overflow-hidden flex justify-center items-center sm:w-1/2 w-full sm:h-full">
      <StyledBackArrow
        onClick={prevSlide}
        current={currentSlide}
        length={length}
        $isBackGround={true}
        $isMobileVisible={true}
        className={cn(
          "z-30 hover:scale-110 transition-all bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md shadow-2xl p-2 duration-300",
          showArrowsInitially
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100",
        )}
      />
      <StyledForwardArrow
        onClick={nextSlide}
        current={currentSlide}
        length={length}
        $isBackGround={true}
        $isMobileVisible={true}
        className={cn(
          "z-30 hover:scale-110 transition-all bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md shadow-2xl p-2 duration-300",
          showArrowsInitially
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100",
        )}
      />

      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <div
          ref={slideRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="flex w-full h-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {datas.map((img, i) => (
            <div
              key={"slide-" + i}
              className="min-w-full h-full flex items-center justify-center p-4"
            >
              <img
                src={img || Constants.LOGO_BLACK}
                alt={`슬라이드 이미지 ${i + 1}`}
                className="max-w-full max-h-full object-contain select-none"
              />
            </div>
          ))}
        </div>
      </div>

      {length > 1 && (
        <div
          className={cn(
            "absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100",
            showArrowsInitially
              ? "opacity-100"
              : "md:opacity-0 md:group-hover:opacity-100 opacity-100",
          )}
        >
          {datas.map((_, index) => (
            <button
              key={"circle" + index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-1.5 transition-all duration-300 rounded-full",
                index === currentSlide
                  ? "w-4 bg-white opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  : "w-1.5 bg-white opacity-40 hover:opacity-60",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Slider;
