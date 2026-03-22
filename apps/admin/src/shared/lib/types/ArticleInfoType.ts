export type ArticleInfoType = {
  id: string | number;
  imgSrcs: {
    originSrc: string;
    smallSrc: string | null;
  }[];
  title: string;
  author: string;
  dateTime: string;
  tags: string[];
  description: string;
};
export type ArticleInfoFormDataType = {
  id: string | number;
  imgSrcs: string[];
  title: string;
  author: string;
  dateTime: string;
  tags: string[];
  description: string;
};
