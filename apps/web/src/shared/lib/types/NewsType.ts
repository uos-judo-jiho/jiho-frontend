import { ArticleInfoType } from "./ArticleInfoType";

export type NewsType = {
  year: string | number;
  images: {
    originSrc: string;
    smallSrc: string | null;
  }[];
  articles: ArticleInfoType[];
};
