import { ArticleInfoType } from "./ArticleInfoType";

export type NewsType = {
  year: string;
  images: string[];
  articles: ArticleInfoType[];
};

export interface INewsType {
  year: string;
  images: string[];
  articles: ArticleInfoType[];
}
