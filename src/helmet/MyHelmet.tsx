import { useEffect, useContext, createContext } from "react";

type MyHelmetProps = {
  title: string;
  description?: string;
  imgUrl?: string;
};

type HelmetData = {
  title: string;
  description: string;
  imgUrl: string;
  url?: string;
};

// Context for SSR
export const HelmetContext = createContext<{ setHelmetData?: (data: HelmetData) => void }>({});

const MyHelmet = ({ title, description, imgUrl }: MyHelmetProps) => {
  const { setHelmetData } = useContext(HelmetContext);

  const helmetData: HelmetData = {
    title: `서울시립대학교 유도부 지호 | ${title}`,
    description: description ?? "서울시립대학교 유도부 지호",
    imgUrl: imgUrl ?? "/favicon-96x96.png",
  };

  // SSR: Store metadata in context
  if (setHelmetData) {
    setHelmetData(helmetData);
  }

  // Client: Update DOM
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = helmetData.title;

    document.querySelector('meta[property="og:title"]')?.setAttribute("content", helmetData.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", helmetData.description);
    document.querySelector('meta[name="description"]')?.setAttribute("content", helmetData.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.href);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", helmetData.imgUrl);
  }, [helmetData.title, helmetData.description, helmetData.imgUrl]);

  return <></>;
};

export default MyHelmet;
