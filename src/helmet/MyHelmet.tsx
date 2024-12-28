import { useEffect } from "react";

type MyHelmetProps = {
  title: string;
  description?: string;
  imgUrl?: string;
};

const MyHelmet = ({ title, description, imgUrl }: MyHelmetProps) => {
  useEffect(() => {
    if (!document) {
      return;
    }
    document.title = `서울시립대학교 유도부 지호 | ${title};`;

    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description ?? "서울시립대학교 유도부 지호");

    document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.href);

    document.querySelector('meta[property="og:image"]')?.setAttribute("content", imgUrl ?? "/favicon-96x96.png");
  }, [description, imgUrl, title]);

  return <></>;
};

export default MyHelmet;
