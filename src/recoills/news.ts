import { useCallback, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { getNews } from "../api/news";
import { NewsType } from "../types/NewsType";

const NewList = atom<NewsType>({
  key: "newObject",
  default: { year: "2022", images: [], articles: [] },
});

export const useNews = () => {
  const [news, setNews] = useRecoilState(NewList);
  const [isLoad, setIsLoad] = useState(false);

  const fetch = useCallback(async () => {
    if (isLoad) {
      return;
    }
    const newNewList = await getNews("2022");

    if (!newNewList) {
      return;
    }

    setNews(newNewList);
    setIsLoad(true);
  }, [isLoad, setNews]);

  const refreshNew = useCallback(() => {
    setIsLoad(false);
    fetch();
  }, [fetch]);

  return { fetch, refreshNew, news };
};
