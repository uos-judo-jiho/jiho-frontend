import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useBodyScrollLock from "../../Hooks/useBodyScrollLock";
import useKeyEscClose from "../../Hooks/useKeyEscClose";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import PhotoModal from "../Modals/PhotoModal";
import { StorageKey } from "../../constant/storageKey";

type NewsIndexProps = {
  articles: ArticleInfoType[];
  images: string[];
  selectedIndex?: number;
};

function NewsIndex({ articles, images, selectedIndex }: NewsIndexProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("p") || "";

  const { lockScroll, openScroll } = useBodyScrollLock();

  const [modalOpen, setModalOpen] = useState(false);

  const handleClickCard = (id: string) => {
    setModalOpen(true);
    setSearchParams({ p: id });
    sessionStorage.setItem(StorageKey.sessionStorage.modal_open.news, "true");
    lockScroll();
  };

  const closeSeeMore = () => {
    setModalOpen(false);
    openScroll();

    sessionStorage.setItem(StorageKey.sessionStorage.modal_open.news, "false");
  };

  useKeyEscClose(closeSeeMore);

  useEffect(() => {
    const sessionModalOpen =
      sessionStorage.getItem(StorageKey.sessionStorage.modal_open.news) ===
      "true";
    if (articles && id && sessionModalOpen) {
      setModalOpen(true);
      lockScroll();
    }

    return () => {
      sessionStorage.setItem(StorageKey.sessionStorage.modal_open.news, "true");
    };
  }, [articles, id, lockScroll]);

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
      {modalOpen && (
        <PhotoModal
          open={modalOpen}
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
