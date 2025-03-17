import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";
import { getNotices } from "@/api/notice";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";

const NoticeList = atom<ArticleInfoType[]>({
  key: "noticeObject",
  default: [],
});

const isNoticeFecthed = atom<boolean>({
  key: "isNoticeFecthed",
  default: false,
});

export const useNotices = () => {
  const [notices, setNotices] = useRecoilState(NoticeList);
  const [isLoad, setIsLoad] = useRecoilState(isNoticeFecthed);

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
  }, [isLoad, setIsLoad, setNotices]);

  const refreshNotice = useCallback(() => {
    setIsLoad(false);
    fetch();
  }, [fetch, setIsLoad]);

  return { fetch, refreshNotice, notices };
};
