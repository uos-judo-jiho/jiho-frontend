import { queryClient } from "@/shared/context/QueryClient";
import { Constants } from "@/shared/lib/constant";
import { NewsType } from "@/shared/lib/types/NewsType";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { getGetNewsQueryOptions, useGetNews } from "@packages/api";
import { GetNewsResponse } from "@packages/api/model";
import { useMemo } from "react";

const normalizeNewsResponse = (
  response: GetNewsResponse | undefined,
  fallbackYear: string,
): NewsType | null => {
  if (!response || typeof response !== "object") {
    return null;
  }

  const newsEntries = Object.entries(response);
  if (!newsEntries.length) {
    return null;
  }

  const [yearKey, newsObject] = newsEntries[0];
  const year = yearKey ?? fallbackYear;
  const articles = Array.isArray(newsObject?.articles)
    ? newsObject.articles
    : undefined;
  const images = Array.isArray(newsObject?.images)
    ? newsObject.images
    : undefined;

  if (!articles || !images) {
    return null;
  }

  return {
    year,
    articles,
    images,
  };
};

const createNewsQueryOptions = (year: string) => {
  const numericYear = Number(year);
  const baseOptions = getGetNewsQueryOptions(numericYear);

  queryClient.setQueryDefaults(baseOptions.queryKey, baseOptions);

  return baseOptions;
};

export const useNewsQuery = (year: string = Constants.LATEST_NEWS_YEAR) => {
  const numericYear = Number(year);
  const queryOptions = createNewsQueryOptions(year);

  const result = useGetNews(numericYear, { query: queryOptions });

  const news = useMemo(
    () => normalizeNewsResponse(result.data, year),
    [result.data, year],
  );

  return {
    ...result,
    data: news,
  };
};

export const useAllNewsQuery = () => {
  return useMemo(() => {
    const years = vaildNewsYearList();

    const newsPromises = years.map(async (year) => {
      const { queryFn, ...options } = createNewsQueryOptions(year);

      const data = await queryClient.fetchQuery({
        queryKey: ["news", year],
        queryFn: () => queryFn({ queryKey: ["news", year] } as any),
        ...options,
      });

      return normalizeNewsResponse(data, year);
    });

    return Promise.all(newsPromises).then((news) =>
      news
        .filter((item): item is NewsType => Boolean(item))
        .sort((a, b) => parseInt(b.year) - parseInt(a.year)),
    );
  }, []);
};
