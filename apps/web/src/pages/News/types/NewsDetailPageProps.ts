import { NewsType } from "@/shared/lib/types/NewsType";

export type NewsDetailPageProps = {
  year: string | number;
  newsId: string;
  articles: Omit<NewsType, "images">;
};
