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
  const [isHighResLoaded, setIsHighResLoaded] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

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

    setIsHighResLoaded(false);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsHighResLoaded(true);
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
