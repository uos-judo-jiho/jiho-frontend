import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

// React 18 은 camelCase `fetchPriority` 를 모르는 속성으로 보고 경고를 낸다.
// (React 19 부터 지원) 소문자 속성으로 직접 넘긴다.
const fetchPriorityAttr = (priority: boolean) =>
  ({ fetchpriority: priority ? "high" : "auto" }) as Record<string, string>;

const ASPECT = {
  square: "aspect-square",
  portrait: "aspect-3/4",
  landscape: "aspect-3/2",
  wide: "aspect-16/9",
  auto: "",
} as const;

type ImageAspect = keyof typeof ASPECT;

type ImageProps = {
  src: string;
  alt: string;
  /** 저해상도 썸네일 — 원본이 도착할 때까지 자리를 채우는 블러 플레이스홀더 */
  lowResSrc?: string | null;
  aspect?: ImageAspect;
  fit?: "cover" | "contain";
  /** 첫 화면에 보이는 이미지는 지연 로딩을 끄고 우선순위를 올린다 */
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

/**
 * 사진 한 장을 안정적으로 그리는 기본 단위.
 *
 * 이전 LazyImage 대비 달라진 점:
 *  - IntersectionObserver + `new Image()` 프리로드를 걷어냈다. 브라우저의
 *    `loading="lazy"` 가 같은 일을 하는데, 기존 구현은 원본을 두 번(감지용 +
 *    실제 표시용) 내려받고 있었다.
 *  - 종횡비 박스를 항상 잡아 이미지 로드 전후 레이아웃 시프트가 없다.
 *  - 저해상도 썸네일은 배경으로 깔아 두어 별도 <img> 를 만들지 않는다.
 */
export const Image = ({
  src,
  alt,
  lowResSrc,
  aspect = "auto",
  fit = "cover",
  priority = false,
  className,
  imageClassName,
}: ImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // SSR 로 내려간 <img> 는 하이드레이션 전에 로드가 끝날 수 있다. 그러면 React 가
  // 리스너를 붙이기 전에 load 이벤트가 지나가 버려서 onLoad 가 영영 오지 않고,
  // 사진이 opacity-0 인 채로 굳는다 (캐시된 재방문·JS 가 느린 회선에서 재현).
  // 마운트 시점에 실제 로드 여부를 직접 확인해 그 구멍을 메운다.
  //
  // src 가 바뀔 때는 일부러 다시 감추지 않는다 — 브라우저는 새 이미지가 도착할
  // 때까지 이전 프레임을 그대로 보여주므로, 여기서 false 로 되돌리면 없어도 될
  // 깜빡임만 생긴다.
  useEffect(() => {
    // complete 는 로드 실패로 끝난 경우에도 true 다. onError 에서도 드러내 주는
    // 기존 동작과 같은 판단이다 — 깨진 이미지라도 자리는 보여야 한다.
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-subtle",
        ASPECT[aspect],
        className,
      )}
      style={
        lowResSrc && !loaded
          ? {
              backgroundImage: `url("${lowResSrc}")`,
              backgroundSize: fit,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...fetchPriorityAttr(priority)}
        onLoad={() => setLoaded(true)}
        // 캐시에서 즉시 그려지면 onLoad 를 놓칠 수 있어 에러 시에도 전환한다
        onError={() => setLoaded(true)}
        className={cn(
          "h-full w-full transition-opacity duration-500 ease-brand",
          fit === "cover" ? "object-cover" : "object-contain",
          loaded ? "opacity-100" : "opacity-0",
          imageClassName,
        )}
      />
      {!loaded && !lowResSrc && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden bg-surface-subtle"
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-line to-transparent" />
        </div>
      )}
    </div>
  );
};
