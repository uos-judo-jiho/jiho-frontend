import { useQuery } from "@tanstack/react-query";
import { getNews } from "./client";

export const useNewsQuery = (year: string) => {
  return useQuery({
    queryKey: ["news", year],
    queryFn: () => getNews(year),
  });
};
