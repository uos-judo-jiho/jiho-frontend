import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import SkeletonThumbnail from "../common/Skeletons/SkeletonThumbnail";

type ThumbnailCardProps = {
  imgSrc: string;
  dateTime: string;
  id: number;
  handleClickCard: (index: number) => void;
};

const ThumbnailCard = ({
  imgSrc,
  dateTime,
  id,
  handleClickCard,
}: ThumbnailCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => handleClickCard(id);

  const handleLoad = () => setIsLoading(true);

  return (
    <li
      onClick={handleClick}
      className="relative w-full aspect-square hover:cursor-pointer after:block after:content-[''] group"
    >
      <a href={`/photo/${id}`} onClick={(e) => e.preventDefault()}>
        {isLoading ? (
          <img
            loading="lazy"
            src={imgSrc}
            alt={"훈련 일지: " + dateTime}
            className="absolute top-0 right-0 w-full aspect-square object-cover transition-[filter] duration-[287ms] sm:group-hover:brightness-50"
          />
        ) : (
          <SkeletonThumbnail />
        )}
        <img
          src={imgSrc}
          alt={"훈련 일지: " + dateTime}
          style={{ display: "none" }}
          onLoad={handleLoad}
        />
        <div
          className={cn(
            "absolute flex justify-center items-center",
            "opacity-0 w-full h-full",
            "text-theme-title text-theme-bg text-white",
            "transition-opacity duration-[287ms]",
            "sm:group-hover:opacity-100",
          )}
        >
          {dateTime}
        </div>
      </a>
    </li>
  );
};

export default ThumbnailCard;
