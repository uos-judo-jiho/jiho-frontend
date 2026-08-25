const CANONICAL_DOMAIN =
  (typeof import.meta.env !== "undefined" &&
    import.meta.env.VITE_CANONICAL_DOMAIN) ||
  "https://uosjudo.com";

const SITE_NAME = "서울시립대학교 유도부 지호";
const DEFAULT_DESCRIPTION = SITE_NAME;
const DEFAULT_IMAGE = "/favicon-96x96.png";

export type SeoHeadOptions = {
  /** 페이지 제목 — "서울시립대학교 유도부 지호 | " 접두어가 자동으로 붙는다 */
  title: string;
  description?: string;
  imgUrl?: string;
  /** canonical URL 계산에 사용할 경로 (예: "/news/2024") */
  pathname?: string;
  articleType?: "article" | "website";
  datePublished?: string;
  dateModified?: string;
  author?: string;
  /** JSON-LD 구조화 데이터 */
  structuredData?: object | null;
};

/**
 * 라우트 head() 옵션으로 넘길 SEO 자산(meta/links/scripts)을 생성한다.
 * 기존 MyHelmet + StructuredData 컴포넌트의 SSR 메타 주입을 대체한다.
 */
export const seoHead = ({
  title: pageTitle,
  description = DEFAULT_DESCRIPTION,
  imgUrl = DEFAULT_IMAGE,
  pathname,
  articleType = "website",
  datePublished,
  dateModified,
  author,
  structuredData,
}: SeoHeadOptions) => {
  const title = `${SITE_NAME} | ${pageTitle}`;
  const canonicalUrl = pathname
    ? `${CANONICAL_DOMAIN}${pathname}`
    : CANONICAL_DOMAIN;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: articleType },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: imgUrl },
  ];

  if (articleType === "article") {
    if (datePublished) {
      meta.push({
        property: "article:published_time",
        content: datePublished,
      });
    }
    if (dateModified) {
      meta.push({ property: "article:modified_time", content: dateModified });
    }
    if (author) {
      meta.push({ property: "article:author", content: author });
    }
  }

  return {
    meta,
    links: [{ rel: "canonical", href: canonicalUrl }],
    scripts: structuredData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(structuredData),
          },
        ]
      : [],
  };
};
