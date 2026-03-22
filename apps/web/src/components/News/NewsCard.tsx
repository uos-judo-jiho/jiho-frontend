import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import { Badge } from "../common/badge";

type NewsCardProps = {
  year: number | string;
  article: ArticleInfoType;
  selectedIndex?: number;
};

const NewsCard = ({ article, year }: NewsCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoding = () => {
    setIsLoading(true);
  };

  return (
    <div
      className={cn(
        "flex w-full text-theme-description leading-theme-description",
        "border border-theme-light-grey p-4",
        "xs:p-2",
      )}
    >
      <a
        href={`/news/${year}/${article.id}`}
        className="w-full flex flex-col items-start gap-4"
      >
        <div className="flex flex-col text-theme-default leading-theme-description w-full indent-1 xs:hidden @container">
          <div className="flex flex-row mb-2.5 justify-between items-start">
            <div className="flex flex-col items-normal justify-normal">
              <div className={cn("flex flex-row gap-4 items-center")}>
                <h3 className="indent-0 text-theme-description leading-theme-description font-bold">
                  {article.title}
                </h3>
                <div className={cn("flex flex-row gap-2")}>
                  {article.tags.map((tag) => (
                    <Badge className="min-w-[48px]" key={tag}>
                      <span className="indent-0 text-theme-tiny leading-theme-tiny text-theme-grey pr-2">
                        # {tag}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-normal justify-normal">
                <span className="indent-0 text-theme-tiny leading-theme-tiny text-theme-grey pr-2">
                  {article.author}
                </span>
              </div>
            </div>
            <div>
              {article.images[0] && (
                <div className="w-24 h-24 relative">
                  {isLoading ? (
                    <picture>
                      <img
                        loading="lazy"
                        alt={article.title + article.author}
                        src={article.images[0].originSrc}
                        className="w-full h-full bg-black object-contain rounded-full"
                      />
                      <source
                        srcSet={
                          article.images[0].smallSrc ||
                          article.images[0].originSrc
                        }
                        media="(max-width: 640px)"
                      />
                    </picture>
                  ) : (
                    <SkeletonThumbnail />
                  )}
                  <picture>
                    <img
                      alt={article.title + article.author}
                      src={article.images[0].originSrc}
                      style={{ display: "none" }}
                      onLoad={handleLoding}
                    />
                    <source
                      srcSet={
                        article.images[0].smallSrc ||
                        article.images[0].originSrc
                      }
                      media="(max-width: 640px)"
                    />
                  </picture>
                  <div className="flex flex-col items-normal justify-normal">
                    <div className="text-theme-description leading-theme-description font-bold pt-2 text-ellipsis overflow-hidden whitespace-nowrap hidden xs:block">
                      {article.title}
                    </div>
                    <div className="text-theme-tiny leading-theme-tiny text-theme-grey hidden xs:block">
                      {article.author}
                    </div>
                    <div className="text-theme-tiny leading-theme-tiny text-theme-grey hidden xs:block">
                      {article.tags}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="indent-0 text-theme-description leading-theme-description text-ellipsis overflow-hidden whitespace-nowrap">
              {/**
               * 1. 이미지 제거 - ![Image](*) 와 같은 문자열 제거
               * 2. # 제거 - #과 함께 단어가 나오는 경우 제거
               * 3. 줄바꿈 제거 - \n 제거
               * 4. --- 제거
               * 5. | 제거
               */}
              {article.description
                .replace(/!\[.*?\]\(.*?\)/g, "") // 이미지 제거
                .replace(/#+/g, "") // # 제거
                .replace(/\n/g, " ")
                .replace(/---/g, " ")
                .replace(/\|/g, " ")}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
};

export default NewsCard;
