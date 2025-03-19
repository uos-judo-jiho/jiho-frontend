import { useEffect } from "react";
import { useNews } from "@/recoils/news";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ArticleForm data={galleryData} type={"news"} gallery />;
};

export default NewsGalleryFrom;
