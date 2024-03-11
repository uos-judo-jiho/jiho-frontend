import { useCallback, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { getNews } from "../api/news";
import { NewsType } from "../types/NewsType";

const NewList = atom<NewsType[]>({
  key: "newObject",
  default: [],
});

export const useNews = () => {
  const [news, setNews] = useRecoilState(NewList);
  const [isLoad, setIsLoad] = useState(false);

  const _filterNews = useCallback(
    (news: NewsType[]) => {
      const filteredNews = news.filter(
        (v, i, a) => a.findIndex((v2) => v2.year === v.year) === i
      );
      setNews(filteredNews);
    },
    [setNews]
  );

  const fetch = useCallback(
    async (year: "2022" | "2023" | "2024" = "2022") => {
      _filterNews(news);
      if (isLoad) {
        return;
      }

      if (
        news.some((newsData) => newsData.year.toString() === year.toString())
      ) {
        return;
      }

      const newNewList = await getNews(year);

      if (!newNewList) {
        return;
      }

      setNews((prev) => [...prev, newNewList]);
      setIsLoad(true);
    },
    [_filterNews, isLoad, news, setNews]
  );

  const refreshNew = useCallback(() => {
    _filterNews(news);
    setIsLoad(false);
    ["2022", "2023", "2024"].forEach(async (year) => {
      await fetch(year as "2022" | "2023" | "2024");
    });
  }, [_filterNews, fetch, news]);

  return { fetch, refreshNew, news };
};
