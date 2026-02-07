import { queryClient } from "@/shared/context/QueryClient";
import { Constants } from "@/shared/lib/constant";
import { NewsType } from "@/shared/lib/types/NewsType";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getNews } from "./client";

const newQueryOptions = (year: string) => ({
  queryKey: ["news", year],
  queryFn: () => getNews(year),
});

export const useNewsQuery = (year: string = Constants.LATEST_NEWS_YEAR) =>
  useQuery(newQueryOptions(year));

export const useAllNewsQuery = (): UseQueryResult<NewsType[]> => {
  return useQuery({
    queryKey: ["allNews"],
    queryFn: async () => {
      const years = vaildNewsYearList();

      const allNewsQuery = years.map((year) =>
        queryClient.fetchQuery(newQueryOptions(year))
      );

      const newsData = await Promise.all(allNewsQuery);

      return newsData
        .filter((news): news is NewsType => Boolean(news))
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));
    },
  });
};
