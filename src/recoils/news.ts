import { useCallback, useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { useQueryClient } from "@tanstack/react-query";
import { useNewsQuery } from "@/api/news/query";
import { getNews } from "@/api/news/client";
import { NewsType } from "@/lib/types/NewsType";
import { vaildNewsYearList } from "@/lib/utils/Utils";

const NewList = atom<NewsType[]>({
  key: "newObject",
  default: [],
});

export const useNews = (year?: string) => {
  const [news, setNews] = useRecoilState(NewList);
  const queryClient = useQueryClient();

  // React Query를 사용하여 현재 year의 데이터 가져오기
  const { data } = useNewsQuery(
    year || vaildNewsYearList().at(-1) || "2025"
  );

  const filterNews = useCallback((news: NewsType[]) => {
    const filteredNews = news.filter(
      (v, i, a) => a.findIndex((v2) => v2.year === v.year) === i
    );
    return filteredNews;
  }, []);

  // React Query 데이터를 Recoil state에 저장 (클라이언트 측)
  useEffect(() => {
    if (data) {
      setNews((prev) => {
        // 중복 제거: 같은 year가 이미 있으면 교체, 없으면 추가
        const existingIndex = prev.findIndex((n) => n.year === data.year);
        if (existingIndex >= 0) {
          const newNews = [...prev];
          newNews[existingIndex] = data;
          return newNews;
        }
        return [...prev, data];
      });
    }
  }, [data, setNews]);

  // 특정 연도의 뉴스를 가져오는 함수
  const fetch = useCallback(
    async (fetchYear: string) => {
      // 이미 캐시에 있는지 확인
      const cachedData = queryClient.getQueryData<NewsType>(["news", fetchYear]);

      if (cachedData) {
        // 캐시된 데이터가 있으면 Recoil state에 추가
        setNews((prev) => {
          const existingIndex = prev.findIndex((n) => n.year === cachedData.year);
          if (existingIndex >= 0) {
            const newNews = [...prev];
            newNews[existingIndex] = cachedData;
            return newNews;
          }
          return [...prev, cachedData];
        });
        return;
      }

      // 캐시에 없으면 새로 가져오기
      const newData = await queryClient.fetchQuery({
        queryKey: ["news", fetchYear],
        queryFn: () => getNews(fetchYear),
        staleTime: 24 * 60 * 60 * 1000, // 1 day
      });

      if (newData) {
        setNews((prev) => {
          const existingIndex = prev.findIndex((n) => n.year === newData.year);
          if (existingIndex >= 0) {
            const newNews = [...prev];
            newNews[existingIndex] = newData;
            return newNews;
          }
          return [...prev, newData];
        });
      }
    },
    [queryClient, setNews]
  );

  const refreshNew = useCallback(async () => {
    await Promise.all(
      vaildNewsYearList().map(async (year) => {
        await fetch(year);
      })
    );
  }, [fetch]);

  // SSR에서는 useEffect가 실행되지 않으므로 data를 직접 사용
  // 클라이언트에서는 Recoil state를 사용 (hydration 이후)
  const effectiveNews = news.length > 0 ? news : data ? [data] : [];

  return { fetch, refreshNew, news: filterNews(effectiveNews) };
};
