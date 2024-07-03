import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";
import { getNews } from "../api/news";
import { NewsType } from "../types/NewsType";
import { vaildNewsYearList } from "../utils/Utils";

const NewList = atom<NewsType[]>({
  key: "newObject",
  default: [],
});

export const useNews = () => {
  const [news, setNews] = useRecoilState(NewList);

  const filterNews = useCallback((news: NewsType[]) => {
    const filteredNews = news.filter((v, i, a) => a.findIndex((v2) => v2.year === v.year) === i);
    return filteredNews;
  }, []);

  const fetch = useCallback(
    async (year: string = "2022") => {
      const newNewList = await getNews(year);

      if (!newNewList) {
        return;
      }

      setNews((prev) => [...prev, newNewList]);
    },
    [setNews]
  );

  const refreshNew = useCallback(async () => {
    await Promise.all(
      vaildNewsYearList().map(async (year) => {
        await fetch(year);
      })
    );
  }, [fetch]);

  return { fetch, refreshNew, news: filterNews(news) };
};
