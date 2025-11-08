import { useState } from "react";

import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import Col from "@/components/layouts/Col";

import { Constants } from "@/lib/constant";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import { cn } from "@/lib/utils";

type NewsCardProps = {
  year: string;
  article: ArticleInfoType;
  selectedIndex?: number;
  handleClickCard: (index: string) => void;
};

const NewsCard = ({ article, handleClickCard, year }: NewsCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const commenter = article.description.slice(0, 100);

  const handleLoding = () => {
    setIsLoading(true);
  };

  return (
    <div
      onClick={() => handleClickCard(article.id)}
      className={cn(
        "flex w-full text-theme-description leading-theme-description",
        "border border-theme-light-grey rounded-[10px] p-4",
        "transition-all duration-500 cursor-pointer",
        "sm:hover:scale-[1.01] sm:hover:shadow-[0.2rem_0.4rem_1.6rem_rgba(0,0,0,0.16)]",
        "xs:p-2"
      )}
    >
      <a
        href={`/news/${year}/${article.id}`}
        onClick={(e) => e.preventDefault()}
        className="w-full flex gap-6"
      >
        <div className="flex-1 w-1/2 rounded-[5px] xs:w-full">
          {isLoading ? (
            <img
              loading="lazy"
              alt={article.title + article.author}
              src={
                article.imgSrcs[0] ? article.imgSrcs[0] : Constants.LOGO_BLACK
              }
              className="w-full h-full rounded-inherit object-contain bg-theme-bg xs:h-auto xs:max-h-[200px]"
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
        <div className="flex flex-col flex-1 text-theme-default leading-theme-description w-full indent-1 xs:hidden">
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
          <div>
            {`${commenter}...`}
            <span>
              <button className="mt-0.5 text-theme-tiny leading-theme-tiny text-theme-text hover:text-theme-grey">
                자세히 보기
              </button>
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default NewsCard;
