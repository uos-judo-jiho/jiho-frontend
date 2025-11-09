import { useEffect, useContext, createContext, useMemo } from "react";

type MyHelmetProps = {
  title: string;
  description?: string;
  imgUrl?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  articleType?: "article" | "website";
};

export type HelmetData = {
  title: string;
  description: string;
  imgUrl: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  articleType?: "article" | "website";
};

// Context for SSR
export const HelmetContext = createContext<{
  setHelmetData?: (data: HelmetData) => void;
}>({});

const MyHelmet = ({
  title,
  description,
  imgUrl,
  datePublished,
  dateModified,
  author,
  articleType = "website",
}: MyHelmetProps) => {
  const { setHelmetData } = useContext(HelmetContext);

  const helmetData: HelmetData = useMemo(
    () => ({
      title: `서울시립대학교 유도부 지호 | ${title}`,
      description: description ?? "서울시립대학교 유도부 지호",
      imgUrl: imgUrl ?? "/favicon-96x96.png",
      datePublished,
      dateModified,
      author,
      articleType,
    }),
    [
      title,
      description,
      imgUrl,
      datePublished,
      dateModified,
      author,
      articleType,
    ],
  );

  // SSR: Store metadata in context
  // This happens during render phase on server
  if (typeof window === "undefined" && setHelmetData) {
    setHelmetData(helmetData);
  }

  // Client: Update DOM
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = helmetData.title;

    // Update basic meta tags
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", helmetData.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", helmetData.description);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", helmetData.description);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", window.location.href);
    document
      .querySelector('meta[property="og:image"]')
      ?.setAttribute("content", helmetData.imgUrl);
    document
      .querySelector('meta[property="og:type"]')
      ?.setAttribute("content", helmetData.articleType || "website");

    // Update or create article meta tags
    if (helmetData.articleType === "article") {
      if (helmetData.datePublished) {
        let publishedMeta = document.querySelector(
          'meta[property="article:published_time"]',
        );
        if (!publishedMeta) {
          publishedMeta = document.createElement("meta");
          publishedMeta.setAttribute("property", "article:published_time");
          document.head.appendChild(publishedMeta);
        }
        publishedMeta.setAttribute("content", helmetData.datePublished);
      }

      if (helmetData.dateModified) {
        let modifiedMeta = document.querySelector(
          'meta[property="article:modified_time"]',
        );
        if (!modifiedMeta) {
          modifiedMeta = document.createElement("meta");
          modifiedMeta.setAttribute("property", "article:modified_time");
          document.head.appendChild(modifiedMeta);
        }
        modifiedMeta.setAttribute("content", helmetData.dateModified);
      }

      if (helmetData.author) {
        let authorMeta = document.querySelector(
          'meta[property="article:author"]',
        );
        if (!authorMeta) {
          authorMeta = document.createElement("meta");
          authorMeta.setAttribute("property", "article:author");
          document.head.appendChild(authorMeta);
        }
        authorMeta.setAttribute("content", helmetData.author);
      }
    }
  }, [helmetData]);

  return <></>;
};

export default MyHelmet;
