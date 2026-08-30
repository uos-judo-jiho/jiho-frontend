import { useCallback, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { ArrowBackIosIcon, ArrowForwardIosIcon } from "@/shared/ui/icons";
import { Image } from "@/shared/ui/image";

type Media = {
  originSrc: string;
  smallSrc: string | null;
};

type MediaCarouselProps = {
  items: Media[];
  /** 각 슬라이드 대체 텍스트의 앞부분 (예: 기사 제목) */
  label: string;
  className?: string;
};

/**
 * 기사·훈련일지 상세의 사진 캐러셀.
 *
 * 이전 Slider 대비:
 *  - transform 대신 CSS 스크롤 스냅을 쓴다. 터치 스와이프가 브라우저 네이티브로
 *    동작하므로 touchstart/touchend 좌표를 직접 계산하던 훅이 사라졌다.
 *  - 화살표가 `window.innerWidth` 를 렌더 중에 읽지 않는다 (SSR 에서 값이 없고,
 *    리사이즈에도 반응하지 않던 코드였다).
 *  - 좌우 방향키로 이동할 수 있고, 현재 위치를 aria-live 로 알린다.
 */
export const MediaCarousel = ({
  items,
  label,
  className,
}: MediaCarouselProps) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const groupId = useId();

  const count = items.length;

  const scrollTo = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[next] as HTMLElement | undefined;
    slide?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, []);

  // 스크롤 위치에서 현재 슬라이드를 역산한다 (스와이프로 움직였을 때도 맞도록)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const next = Math.round(track.scrollLeft / track.clientWidth);
      setIndex((prev) => (prev === next ? prev : next));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  if (count === 0) return null;

  const go = (delta: number) => {
    const next = Math.min(Math.max(index + delta, 0), count - 1);
    setIndex(next);
    scrollTo(next);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${label} 사진`}
      className={cn("group relative isolate", className)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        }
      }}
    >
      <ul
        ref={trackRef}
        id={groupId}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-md bg-inverse"
      >
        {items.map((item, i) => (
          <li
            key={item.originSrc + i}
            aria-label={`${i + 1} / ${count}`}
            aria-roledescription="slide"
            className="w-full shrink-0 snap-start"
          >
            {/* 세로 사진과 가로 사진이 섞여 들어오므로 종횡비를 고정하는 대신
                높이를 제한하고 contain 으로 맞춘다 */}
            <Image
              src={item.originSrc}
              lowResSrc={item.smallSrc}
              alt={`${label} — 사진 ${i + 1}`}
              fit="contain"
              priority={i === 0}
              className="h-[min(68svh,34rem)] w-full bg-inverse"
            />
          </li>
        ))}
      </ul>

      {count > 1 && (
        <>
          <CarouselButton
            direction="prev"
            disabled={index === 0}
            controls={groupId}
            onClick={() => go(-1)}
          />
          <CarouselButton
            direction="next"
            disabled={index === count - 1}
            controls={groupId}
            onClick={() => go(1)}
          />

          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <div className="flex items-center gap-1.5 rounded-full bg-inverse/70 px-2.5 py-1.5 backdrop-blur-sm">
              {items.map((item, i) => (
                <button
                  key={`dot-${item.originSrc}-${i}`}
                  type="button"
                  aria-label={`${i + 1}번째 사진으로 이동`}
                  aria-current={i === index}
                  onClick={() => {
                    setIndex(i);
                    scrollTo(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-brand",
                    i === index
                      ? "w-5 bg-on-inverse"
                      : "w-1.5 bg-on-inverse/45 hover:bg-on-inverse/70",
                  )}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <p aria-live="polite" className="sr-only">
        {index + 1} / {count}
      </p>
    </section>
  );
};

const CarouselButton = ({
  direction,
  disabled,
  controls,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  controls: string;
  onClick: () => void;
}) => {
  const Icon = direction === "prev" ? ArrowBackIosIcon : ArrowForwardIosIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-controls={controls}
      aria-label={direction === "prev" ? "이전 사진" : "다음 사진"}
      className={cn(
        "absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full",
        "bg-inverse/55 text-on-inverse backdrop-blur-sm transition duration-200 ease-brand",
        "hover:bg-inverse/80 disabled:pointer-events-none disabled:opacity-0",
        // 포인터가 있는 기기에서는 호버 시에만 드러내 사진을 가리지 않는다
        "sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
        direction === "prev" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-4" decorative />
    </button>
  );
};
