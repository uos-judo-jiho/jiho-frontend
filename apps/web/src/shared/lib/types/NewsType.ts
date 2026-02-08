import { ArticleInfoType } from "./ArticleInfoType";

export type NewsType = {
  year: string | number;
  images: string[];
  articles: ArticleInfoType[];
};

export interface INewsType {
  year: string | number;
  images: string[];
  articles: ArticleInfoType[];
}
