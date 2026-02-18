import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import SkeletonThumbnail from "../Skeletons/SkeletonThumbnail";

export const LazyImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoad = () => setIsLoading(true);

  return (
    <>
      {isLoading ? (
        <img
          loading="lazy"
          src={src}
          alt={alt}
          className={cn(
            "absolute top-0 right-0 w-full aspect-square object-cover transition-[filter] duration-[287ms] sm:group-hover:brightness-50",
            className,
          )}
        />
      ) : (
        <SkeletonThumbnail />
      )}
      <img
        src={src}
        alt={alt}
        style={{ display: "none" }}
        onLoad={handleLoad}
      />
    </>
  );
};
