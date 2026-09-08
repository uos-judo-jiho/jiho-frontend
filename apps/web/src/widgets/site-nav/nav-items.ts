import { linkOptions, type LinkOptions } from "@tanstack/react-router";

export type NavItem = {
  title: string;
  link: LinkOptions;
  /** 하위 메뉴가 있으면 드로어에서 접었다 펼 수 있다 */
  children?: { title: string; link: LinkOptions }[];
};

/**
 * 사이트 내비게이션의 단일 정의.
 * 데스크톱 헤더와 모바일 드로어가 같은 배열을 읽으므로 메뉴가 어긋날 일이 없다.
 */
export const buildNavItems = (newsYears: number[]): NavItem[] => [
  {
    title: "지호지",
    link: linkOptions({ to: "/news" }),
    children: newsYears.map((year) => ({
      title: `${year}년`,
      link: linkOptions({ to: "/news/$id", params: { id: String(year) } }),
    })),
  },
  { title: "훈련일지", link: linkOptions({ to: "/photo" }) },
  { title: "앨범", link: linkOptions({ to: "/album" }) },
  { title: "공지사항", link: linkOptions({ to: "/notice" }) },
  { title: "소개", link: linkOptions({ to: "/about" }) },
];
