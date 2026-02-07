import { NewsType } from "@/shared/lib/types/NewsType";

export type NewsDetailPageProps = {
  year: string;
  newsId: string;
  news: NewsType;
};
