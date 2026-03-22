import { useState } from "react";

import SkeletonThumbnail from "@/components/common/Skeletons/SkeletonThumbnail";
import Col from "@/components/layouts/Col";

import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { cn } from "@/shared/lib/utils";
import { Badge } from "../common/badge";
import Row from "../layouts/Row";

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
          <div className="mb-2.5">
            <Col>
              <Row alignItems="center" gap={4}>
                <h3 className="indent-0 text-theme-description leading-theme-description font-bold">
                  {article.title}
                </h3>
                <Row alignItems="center" gap={4}>
                  {article.tags.map((tag) => (
                    <Badge className="min-w-[48px]" key={tag}>
                      <span className="indent-0 text-theme-tiny leading-theme-tiny text-theme-grey pr-2">
                        # {tag}
                      </span>
                    </Badge>
                  ))}
                </Row>
              </Row>
              <Col>
                <span className="indent-0 text-theme-tiny leading-theme-tiny text-theme-grey pr-2">
                  {article.author}
                </span>
              </Col>
            </Col>
          </div>
        </div>
        {article.images[0] && (
          <div className="w-full h-full flex items-center justify-center relative">
            {isLoading ? (
              <picture>
                <img
                  loading="lazy"
                  alt={article.title + article.author}
                  src={article.images[0].originSrc}
                  className="w-full h-full bg-black object-contain"
                />
                <source
                  srcSet={
                    article.images[0].smallSrc || article.images[0].originSrc
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
                  article.images[0].smallSrc || article.images[0].originSrc
                }
                media="(max-width: 640px)"
              />
            </picture>
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
        )}
      </a>
    </div>
  );
};

export default NewsCard;
