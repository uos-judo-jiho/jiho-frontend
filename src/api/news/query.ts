import { queryClient } from "@/context/QueryClient";
import { Constants } from "@/lib/constant";
import { NewsType } from "@/lib/types/NewsType";
import { vaildNewsYearList } from "@/lib/utils/Utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getNews } from "./client";

export const useNewsQuery = (year: string = Constants.LATEST_NEWS_YEAR) => {
  return useQuery({
    queryKey: ["news", year],
    queryFn: () => getNews(year),
  });
};

export const useAllNewsQuery = (): UseQueryResult<NewsType[]> => {
  return useQuery({
    queryKey: ["allNews"],
    queryFn: async () => {
      const years = vaildNewsYearList();

      const allNewsQuery = years.map((year) =>
        queryClient.fetchQuery({
          queryKey: ["news", year],
          queryFn: () => getNews(year),
        })
      );

      const newsData = await Promise.all(allNewsQuery);

      return newsData
        .filter((news): news is NewsType => Boolean(news))
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));
    },
  });
};
