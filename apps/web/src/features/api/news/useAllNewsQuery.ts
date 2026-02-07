import { queryClient } from "@/shared/context/QueryClient";
import { NewsType } from "@/shared/lib/types/NewsType";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { getGetNewsQueryOptions } from "@uos-judo/api";
import { GetNewsResponse } from "@uos-judo/api/model";
import { useMemo } from "react";

const normalizeNewsResponse = (
  response: GetNewsResponse | undefined,
  year: string,
): NewsType | null => {
  if (!response || typeof response !== "object") {
    return null;
  }

  const newsEntries = Object.entries(response);
  if (!newsEntries.length) {
    return null;
  }

  const newsObject = newsEntries[0][1];
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

export const useAllNewsQuery = () => {
  const years = useMemo(() => vaildNewsYearList(), []);

  const promises = years.map(async (year) => {
    const numericYear = Number(year);
    const options = getGetNewsQueryOptions(numericYear);

    const data = await queryClient.fetchQuery({
      queryKey: options.queryKey,
      queryFn: options.queryFn,
    });

    return normalizeNewsResponse(data, year);
  });

  return Promise.all(promises).then((news) =>
    news
      .filter((item): item is NewsType => Boolean(item))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year)),
  );
};
