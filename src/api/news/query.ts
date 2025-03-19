import { useQuery } from "@tanstack/react-query";
import { getNews } from "./client";

export const useNewsQuery = (year: string) => {
  return useQuery({
    queryKey: ["news", year],
    queryFn: () => {
      return getNews(year);
    },
    staleTime: 24 * 60 * 60 * 1000, // 1 day
  });
};
