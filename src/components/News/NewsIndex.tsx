import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useBodyScrollLock from "../../Hooks/useBodyScrollLock";
import useKeyEscClose from "../../Hooks/useKeyEscClose";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import PhotoModal from "../Modals/PhotoModal";

type NewsIndexProps = {
  articles: ArticleInfoType[];
  images: string[];
  selectedIndex?: number;
};

function NewsIndex({ articles, images, selectedIndex }: NewsIndexProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("p") || "";

  const { lockScroll, openScroll } = useBodyScrollLock();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClickCard = (id: string) => {
    setIsModalOpen(true);
    setSearchParams({ p: id });
    lockScroll();
  };

  const closeSeeMore = () => {
    setIsModalOpen(false);
    openScroll();
  };

  useKeyEscClose(closeSeeMore);

  useEffect(() => {
    if (id) {
      setIsModalOpen(true);
      lockScroll();
    }
  }, [id, lockScroll]);
  return (
    <>
      <Carousel datas={images}></Carousel>
      <NewsCardContainer>
        {articles.map((item, index) => {
          return (
            <NewsCard
              key={item.id}
              index={index}
              datas={articles}
              selectedIndex={selectedIndex}
              handleClickCard={handleClickCard}
            />
          );
        })}
      </NewsCardContainer>
      {isModalOpen && (
        <PhotoModal
          open={isModalOpen}
          close={closeSeeMore}
          infos={articles}
          id={id}
          titles={["작성자", "태그", "작성 일자"]}
        />
      )}
    </>
  );
}

export default NewsIndex;
