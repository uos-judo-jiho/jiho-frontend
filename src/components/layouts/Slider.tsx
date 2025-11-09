import { useEffect, useRef, useState } from "react";

import useTouchScroll from "@/hooks/useTouchScroll";
import { Constants } from "@/lib/constant";
import { StyledBackArrow, StyledForwardArrow } from "./Arrow";
import { cn } from "@/lib/utils";

// TODO 페이지 넘길 때 사진이 흘러가는 에니메이션 막기

type SliderProps = {
  datas: string[];
};

function Slider({ datas }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [length, setLength] = useState(datas.length);

  const slideRef = useRef<any>(null);
  function nextSlide() {
    setCurrentSlide((prev) => {
      if (prev === length - 1) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  }

  function prevSlide() {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        return prev;
      } else {
        return prev - 1;
      }
    });
  }

  const { onTouchStart, onTouchEnd } = useTouchScroll([nextSlide, prevSlide]);

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transition = "all 0.5s ease-in-out";
      slideRef.current.style.transform = `translateX(-${currentSlide}00%)`;
    }
  }, [currentSlide]);

  useEffect(() => {
    setCurrentSlide(0);
    setLength(datas.length);
  }, [datas]);

  if (!Array.isArray(datas) || datas.length <= 0) {
    console.error("Image가 존재하지 않습니다.");

    return null;
  }
  return (
    <section className="relative overflow-hidden flex justify-center items-center sm:w-1/2 w-full sm:h-full">
      <StyledBackArrow
        onClick={prevSlide}
        current={currentSlide}
        length={length}
        $isBackGround={true}
        $isMobileVisible={true}
      />
      <StyledForwardArrow
        onClick={nextSlide}
        current={currentSlide}
        length={length}
        $isBackGround={true}
        $isMobileVisible={true}
      />
      <div className="w-full h-full block bg-gradient-to-b from-[#fc9857] via-[#a56826] to-[#fc9857]">
        <div
          ref={slideRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative w-full h-full flex items-center"
        >
          {datas.map((img, i) => (
            <img
              src={img ? img : Constants.LOGO_BLACK}
              key={"thumbnail" + i}
              alt={`슬라이드 이미지 ${i + 1}`}
              className={cn(
                "sm:max-w-[30vw] sm:max-h-[30vw] max-w-[60vw] max-h-[60vw] min-w-full object-contain",
                img ? "bg-black" : "bg-background",
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-center -translate-y-5">
          {datas.length === 1
            ? null
            : datas.map((_image, index) => {
                return (
                  <div
                    key={"circle" + index}
                    className={cn(
                      "w-1 h-1 rounded-full mx-1 opacity-30",
                      index === currentSlide
                        ? "w-1.5 h-1.5 opacity-100 bg-background"
                        : "bg-muted",
                    )}
                  />
                );
              })}
        </div>
      </div>
    </section>
  );
}

export default Slider;
