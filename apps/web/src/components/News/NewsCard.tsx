import { useState } from "react";

import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import Col from "@/components/layouts/Col";

import { Constants } from "@/shared/lib/constant";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { cn } from "@/shared/lib/utils";

type NewsCardProps = {
  year: number | string;
  article: ArticleInfoType;
  selectedIndex?: number;
};

const NewsCard = ({ article, year }: NewsCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const commenter = article.description;

  const handleLoding = () => {
    setIsLoading(true);
  };

  return (
    <div
      className={cn(
        "flex w-full text-theme-description leading-theme-description",
        "border border-theme-light-grey p-4 sm:h-[320px] h-[400px]",
        "xs:p-2",
      )}
    >
      <a
        href={`/news/${year}/${article.id}`}
        className="w-full h-full flex flex-row items-start gap-4"
      >
        <div className="flex-1 h-full">
          {isLoading ? (
            <img
              loading="lazy"
              alt={article.title + article.author}
              src={
                article.imgSrcs[0] ? article.imgSrcs[0] : Constants.LOGO_BLACK
              }
              className="w-full h-full bg-black object-contain"
            />
          ) : (
            <SkeletonThumbnail />
          )}
          <img
            alt={article.title + article.author}
            src={article.imgSrcs[0] ? article.imgSrcs[0] : Constants.LOGO_BLACK}
            style={{ display: "none" }}
            onLoad={handleLoding}
          />
          <Col>
            <div className="text-theme-description leading-theme-description font-bold pt-2 text-ellipsis overflow-hidden whitespace-nowrap hidden xs:block">
              {article.title}
            </div>
            <div className="text-theme-tiny leading-theme-tiny text-theme-grey hidden xs:block">
              {article.author}
            </div>
            <div className="text-theme-tiny leading-theme-tiny text-theme-grey hidden xs:block">
              {article.tags}
            </div>
          </Col>
        </div>
        <div className="flex flex-col flex-1 h-full text-theme-default leading-theme-description w-full indent-1 xs:hidden @container">
          <div className="mb-2.5">
            <Col>
              <h3 className="indent-0 text-theme-description leading-theme-description font-bold">
                {article.title}
              </h3>
              <Col>
                <span className="indent-0 text-theme-tiny leading-theme-tiny text-theme-grey pr-2">
                  {article.author}
                </span>
                <span className="indent-0 text-theme-tiny leading-theme-tiny text-theme-grey pr-2">
                  {article.tags}
                </span>
              </Col>
            </Col>
          </div>
          <div className="overflow-hidden h-[25cqh] leading-normal">
            {commenter}
          </div>

          <button className="mt-4 text-theme-tiny leading-theme-tiny text-theme-grey text-left">
            ...자세히 보기
          </button>
        </div>
      </a>
    </div>
  );
};

export default NewsCard;
