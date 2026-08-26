import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import NotFound from "@/pages/NotFound";

// side-effect import: Start 가 client 매니페스트 기준으로 <link> 를 주입하므로
// SSR 번들이 자체 계산한 (client 와 어긋날 수 있는) asset URL 을 참조하지 않는다
import "@/app/index.css";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  // SSR HTML 은 해시된 자산 URL 을 참조하므로 절대 stale 하게 재사용되면
  // 안 된다 (옛 HTML 이 캐시되면 배포 후 사라진 옛 해시 자산을 요청해 404).
  // no-cache = 캐시하되 매 사용 전 서버 재검증.
  headers: () => ({ "cache-control": "no-cache" }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "서울시립대학교 유도부 지호" },
      { name: "title", content: "서울시립대학교 유도부 지호" },
      { name: "description", content: "서울시립대학교 유도부 지호" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "서울시립대학교 유도부 지호" },
      { property: "og:description", content: "서울시립대학교 유도부 지호" },
      { property: "og:url", content: "https://uosjudo.com" },
      { property: "og:image", content: "/favicon-96x96.png" },
      { name: "msapplication-TileColor", content: "#ffffff" },
      { name: "msapplication-TileImage", content: "/ms-icon-144x144.png" },
      { name: "theme-color", content: "#000000" },
      {
        name: "google-site-verification",
        content: "yneFuEywicpsOuZx6g_znGWaJqeBxHf267BC1odklrw",
      },
      {
        name: "naver-site-verification",
        content: "107d360f3a1b219ad68f5cde4458b99197e72711",
      },
    ],
    links: [
      { hrefLang: "ko-KR", rel: "alternate", href: "http://uosjudo.com" },
      { rel: "apple-touch-icon", sizes: "57x57", href: "/apple-icon-57x57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", href: "/apple-icon-60x60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", href: "/apple-icon-72x72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", href: "/apple-icon-76x76.png" },
      {
        rel: "apple-touch-icon",
        sizes: "114x114",
        href: "/apple-icon-114x114.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "120x120",
        href: "/apple-icon-120x120.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "144x144",
        href: "/apple-icon-144x144.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "152x152",
        href: "/apple-icon-152x152.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-icon-180x180.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/android-icon-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/manifest.json" },
    ],
    scripts: [
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-TLK4ZTXFH0",
      },
      {
        children: `window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-TLK4ZTXFH0");`,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
