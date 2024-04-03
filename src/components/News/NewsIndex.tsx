import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useKeyEscClose from "../../Hooks/useKeyEscClose";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import PhotoModal from "../Modals/PhotoModal";

type NewsIndexProps = {
  articles: ArticleInfoType[];
  images: string[];
  selectedIndex?: number;
  index: string;
  year: string;
};

const NewsIndex = ({ articles, images, selectedIndex, index, year }: NewsIndexProps) => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const handleClickCard = (index: string) => {
    setModalOpen(true);
    navigate(`/news/${year}/${index}`, { replace: true });
  };

  const closeSeeMore = () => {
    setModalOpen(false);
  };

  useKeyEscClose(closeSeeMore);

  useEffect(() => {
    if (index) {
      setModalOpen(true);
    }
  }, [index]);

  return (
    <>
      <Carousel datas={images}></Carousel>
      <NewsCardContainer>
        {articles.map((item, index) => (
          <NewsCard key={item.id} index={index} year={year} datas={articles} selectedIndex={selectedIndex} handleClickCard={handleClickCard} />
        ))}
      </NewsCardContainer>
      {modalOpen && <PhotoModal baseurl={`news/${year}`} open={modalOpen} close={closeSeeMore} infos={articles} id={index} titles={["작성자", "태그", "작성 일자"]} />}
    </>
  );
};

export default NewsIndex;
