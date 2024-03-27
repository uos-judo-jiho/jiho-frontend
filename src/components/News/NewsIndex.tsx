import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useKeyEscClose from "../../Hooks/useKeyEscClose";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import PhotoModal from "../Modals/PhotoModal";

type NewsIndexProps = {
  articles: ArticleInfoType[];
  images: string[];
  selectedIndex?: number;
};

function NewsIndex({ articles, images, selectedIndex }: NewsIndexProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.replace(/^\/news\/20[0-9]{2}/gm, "").replace("/", "") ?? "";

  const [modalOpen, setModalOpen] = useState(false);

  const handleClickCard = (id: string) => {
    setModalOpen(true);
    navigate(`/news/2022/${id}`, { replace: true });
  };

  const closeSeeMore = () => {
    setModalOpen(false);
  };

  useKeyEscClose(closeSeeMore);

  useEffect(() => {
    if (id) {
      setModalOpen(true);
    }
  }, [id]);

  return (
    <>
      <Carousel datas={images}></Carousel>
      <NewsCardContainer>
        {articles.map((item, index) => (
          <NewsCard key={item.id} index={index} datas={articles} selectedIndex={selectedIndex} handleClickCard={handleClickCard} />
        ))}
      </NewsCardContainer>
      {modalOpen && <PhotoModal baseurl={"news/2022"} open={modalOpen} close={closeSeeMore} infos={articles} id={id} titles={["작성자", "태그", "작성 일자"]} />}
    </>
  );
}

export default NewsIndex;
