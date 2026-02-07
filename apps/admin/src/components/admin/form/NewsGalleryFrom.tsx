import { normalizeNewsResponse } from "@/shared/lib/api/news";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { v1Api } from "@packages/api";
import { useMemo } from "react";
import ArticleForm from "./ArticleForm";

type NewsGalleryFromProps = {
  year: string;
};

const NewsGalleryFrom = ({ year }: NewsGalleryFromProps) => {
  const { data: response } = v1Api.useGetApiV1NewsYear(Number(year), {
    query: {
      enabled: Boolean(year),
      select: (result) => result.data,
    },
  });

  const newsData = useMemo(
    () => normalizeNewsResponse(response, year),
    [response, year],
  );

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
