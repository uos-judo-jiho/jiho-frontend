export type ArticleInfoType = {
  id: string | number;
  images: {
    originSrc: string;
    smallSrc: string | null;
  }[];
  title: string;
  author: string;
  dateTime: string;
  tags: string[];
  description: string;
};
