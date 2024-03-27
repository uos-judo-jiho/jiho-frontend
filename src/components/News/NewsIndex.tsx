import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { useEffect, useState } from "react";
import useBodyScrollLock from "../../Hooks/useBodyScrollLock";
import useKeyEscClose from "../../Hooks/useKeyEscClose";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import PhotoModal from "../Modals/PhotoModal";
import { useLocation, useNavigate } from "react-router-dom";

type NewsIndexProps = {
  articles: ArticleInfoType[];
  images: string[];
  selectedIndex?: number;
};

function NewsIndex({ articles, images, selectedIndex }: NewsIndexProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.replace("news", "").split("/").at(-1) ?? "";

  const { lockScroll, openScroll } = useBodyScrollLock();

  const [modalOpen, setModalOpen] = useState(false);

  const handleClickCard = (id: string) => {
    setModalOpen(true);
    lockScroll();
    navigate(`/news/2022/${id}`, { replace: true });
  };

  const closeSeeMore = () => {
    setModalOpen(false);
    openScroll();
  };

  useKeyEscClose(closeSeeMore);

  useEffect(() => {
    if (articles && id) {
      setModalOpen(true);
      lockScroll();
    }
  }, [articles, id, lockScroll, openScroll]);

  useEffect(() => {
    if (!modalOpen || !id) {
      openScroll();
    }
    return () => {
      openScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          baseurl={"news/2022"}
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
