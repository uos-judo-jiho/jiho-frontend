import { useEffect } from "react";
import { useNews } from "../../../recoills/news";
import { ArticleInfoType } from "../../../types/ArticleInfoType";
import ArticleForm from "./ArticleForm";

type NewsGalleryFromProps = {
  year: string;
};
const NewsGalleryFrom = ({ year }: NewsGalleryFromProps) => {
  const { news, refreshNew } = useNews();

  const galleryData: ArticleInfoType | undefined = news
    .filter((newsData) => year.startsWith(newsData.year))
    .map((newsData, index) => ({
      id: `${newsData.year}${index}`,
      imgSrcs: newsData.images,
      title: "",
      author: "",
      dateTime: year,
      tags: [],
      description: "",
    }))
    .at(0);

  useEffect(() => {
    refreshNew();
  }, []);

  return <ArticleForm data={galleryData} type={"news"} gallery />;
};

export default NewsGalleryFrom;