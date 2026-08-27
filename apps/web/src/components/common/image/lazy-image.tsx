import { cn } from "@/shared/lib/utils";
import { useEffect, useRef, useState } from "react";
import SkeletonThumbnail from "../Skeletons/SkeletonThumbnail";

export const LazyImage = ({
  src,
  lowResSrc,
  alt,
  className,
}: {
  src: string;
  lowResSrc?: string;
  alt: string;
  className?: string;
}) => {
  // 고해상도 로딩 완료 여부는 "어떤 src 가 로드됐는지"로 들고 있는다.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // 뷰포트에 들어오기 전에는 로딩을 시작하지 않으므로 폴백을 띄우지 않고,
  // 들어온 뒤에는 현재 src 가 실제로 로드됐는지로 판단한다.
  const isHighResLoaded = !isInView || loadedSrc === src;

  useEffect(() => {
    // Check if IntersectionObserver is available (for SSR/old browsers)
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }, // Start loading when image is 200px away from viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoadedSrc(src);
    };
  }, [src, isInView]);

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden bg-neutral-900/10", className)}
    >
      {/* High-res Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          "w-full h-full object-cover transition-opacity duration-200 ease-linear",
          isHighResLoaded ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Low-res Placeholder */}
      {lowResSrc && !isHighResLoaded && (
        <img
          src={lowResSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      {/* Skeleton fallback if no low-res source provided */}
      {!lowResSrc && !isHighResLoaded && (
        <div className="absolute inset-0">
          <SkeletonThumbnail />
        </div>
      )}
    </div>
  );
};
