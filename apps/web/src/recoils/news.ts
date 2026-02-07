import { normalizeNewsResponse } from "@/shared/lib/api/news";
import { NewsType } from "@/shared/lib/types/NewsType";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v1Api } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export const useNews = (year?: string) => {
  const queryClient = useQueryClient();
  const selectedYear = year || vaildNewsYearList().at(-1) || "";

  // React Query를 사용하여 현재 year의 데이터 가져오기
  const { data: response } = v1Api.useGetApiV1NewsYear(Number(selectedYear), {
    query: {
      enabled: Boolean(selectedYear),
      select: (result) => result.data,
    },
  });

  const data = useMemo(
    () => normalizeNewsResponse(response, selectedYear),
    [response, selectedYear],
  );

  // 모든 캐시된 뉴스 데이터 가져오기
  const allNews = useMemo(() => {
    const newsData: NewsType[] = [];
    vaildNewsYearList().forEach((yearKey) => {
      const options = v1Api.getGetApiV1NewsYearQueryOptions(Number(yearKey));
      const cachedResponse = queryClient.getQueryData<{
        data: unknown;
      }>(options.queryKey);
      const normalized = normalizeNewsResponse(
        cachedResponse?.data as any,
        yearKey,
      );

      if (normalized) {
        newsData.push(normalized);
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
      const options = v1Api.getGetApiV1NewsYearQueryOptions(Number(fetchYear));
      await queryClient.fetchQuery(options);
    },
    [queryClient],
  );

  const refreshNew = useCallback(async () => {
    await Promise.all(
      vaildNewsYearList().map(async (year) => {
        await fetch(year);
      }),
    );
  }, [fetch]);

  // 중복 제거된 뉴스 목록 반환
  const uniqueNews = useMemo(() => {
    return allNews.filter(
      (v, i, a) => a.findIndex((v2) => v2.year === v.year) === i,
    );
  }, [allNews]);

  return { fetch, refreshNew, news: uniqueNews };
};
