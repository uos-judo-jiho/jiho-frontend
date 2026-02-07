import { getNews } from "@/features/api/news/client";
import { useNewsQuery } from "@/features/api/news/query";
import { NewsType } from "@/shared/lib/types/NewsType";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export const useNews = (year?: string) => {
  const queryClient = useQueryClient();

  // React Query를 사용하여 현재 year의 데이터 가져오기
  const { data } = useNewsQuery(year || vaildNewsYearList().at(-1));

  // 모든 캐시된 뉴스 데이터 가져오기
  const allNews = useMemo(() => {
    const newsData: NewsType[] = [];
    vaildNewsYearList().forEach((yearKey) => {
      const cachedData = queryClient.getQueryData<NewsType>(["news", yearKey]);
      if (cachedData) {
        newsData.push(cachedData);
      }
    });

    // 현재 year의 데이터가 캐시에 없으면 추가
    if (data && !newsData.find((n) => n.year === data.year)) {
      newsData.push(data);
    }

    return newsData;
  }, [queryClient, data]);

  // 특정 연도의 뉴스를 가져오는 함수
  const fetch = useCallback(
    async (fetchYear: string) => {
      // React Query 캐시에서 가져오거나 새로 fetch
      await queryClient.fetchQuery({
        queryKey: ["news", fetchYear],
        queryFn: () => getNews(fetchYear),
        staleTime: 24 * 60 * 60 * 1000, // 1 day
      });
    },
    [queryClient]
  );

  const refreshNew = useCallback(async () => {
    await Promise.all(
      vaildNewsYearList().map(async (year) => {
        await fetch(year);
      })
    );
  }, [fetch]);

  // 중복 제거된 뉴스 목록 반환
  const uniqueNews = useMemo(() => {
    return allNews.filter(
      (v, i, a) => a.findIndex((v2) => v2.year === v.year) === i
    );
  }, [allNews]);

  return { fetch, refreshNew, news: uniqueNews };
};
