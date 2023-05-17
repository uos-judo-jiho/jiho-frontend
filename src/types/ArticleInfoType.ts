export type ArticleInfoType = {
  id: string;
  imgSrcs: string[];
  title: string;
  author: string;
  dateTime: string;
  tags: string[];
  description: string;
};
export type ArticleInfoFormDataType = {
  id: string;
  imgSrcs: File[];
  title: string;
  author: string;
  dateTime: string;
  tags: string[];
  description: string;
};

export type TrainingLogsType = {
  trainingLogs: Array<ArticleInfoType>;
};
