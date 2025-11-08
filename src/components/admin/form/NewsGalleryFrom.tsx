import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import ArticleForm from "./ArticleForm";
import { useNewsQuery } from "@/api/news/query";

type NewsGalleryFromProps = {
  year: string;
};

const NewsGalleryFrom = ({ year }: NewsGalleryFromProps) => {
  const { data: newsData } = useNewsQuery(year);

  const galleryData: ArticleInfoType | undefined = newsData
    ? {
        id: `${newsData.year}-gallery`,
        imgSrcs: newsData.images,
        title: "",
        author: "",
        dateTime: year,
        tags: [],
        description: "",
      }
    : undefined;

  return <ArticleForm data={galleryData} type={"news"} gallery />;
};

export default NewsGalleryFrom;
