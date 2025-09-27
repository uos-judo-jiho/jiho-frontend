import { NewsType } from "@/lib/types/NewsType";

export type NewsDetailPageProps = {
  year: string;
  newsId: string;
  news: NewsType;
};
