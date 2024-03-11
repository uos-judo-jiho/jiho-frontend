import { useCallback, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { getNotices } from "../api/notice";
import { ArticleInfoType } from "../types/ArticleInfoType";

const NoticeList = atom<ArticleInfoType[]>({
  key: "noticeObject",
  default: [],
});

export const useNotices = () => {
  const [notices, setNotices] = useRecoilState(NoticeList);
  const [isLoad, setIsLoad] = useState(false);

  const fetch = useCallback(async () => {
    if (isLoad) {
      return;
    }
    const newNoticeList = await getNotices();
    if (!newNoticeList) {
      return;
    }

    setNotices(newNoticeList);
    setIsLoad(true);
  }, [isLoad, setNotices]);

  const refreshNotice = useCallback(() => {
    setIsLoad(false);
    fetch();
  }, [fetch]);

  return { fetch, refreshNotice, notices };
};
