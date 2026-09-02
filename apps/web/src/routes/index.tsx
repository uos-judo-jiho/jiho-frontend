import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/pages/home-page";

import { latestBoardsQueryOptions } from "@/features/content";
import { latestNewsQueryOptions } from "@/features/news";
import { createOrganizationData } from "@/features/seo";
import { seoHead } from "@/features/seo/head";
import BGImageWebp from "@/shared/lib/assets/images/background-img-group.webp";
import { SITE } from "@/shared/config/site";
import { HOME_NOTICE_LIMIT, HOME_TRAINING_LIMIT } from "@/widgets/home";
import { v2Api } from "@packages/api";

const CANONICAL_DOMAIN =
  import.meta.env.VITE_CANONICAL_DOMAIN || "https://uosjudo.com";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    try {
      // 홈에서 사용하는 쿼리를 모두 프리페치해 SSR/CSR 렌더 결과를 일치시킨다
      const [response] = await Promise.all([
        context.queryClient.ensureQueryData(v2Api.getListAwardsQueryOptions()),
        context.queryClient.ensureQueryData(
          latestBoardsQueryOptions({
            type: "training",
            limit: HOME_TRAINING_LIMIT,
          }),
        ),
        context.queryClient.ensureQueryData(
          latestBoardsQueryOptions({
            type: "notice",
            limit: HOME_NOTICE_LIMIT,
          }),
        ),
        context.queryClient.ensureQueryData(latestNewsQueryOptions()),
      ]);
      return { awards: response.data.items };
    } catch (error) {
      console.error("[SSR] Home prefetch error:", error);
      return { awards: [] };
    }
  },
  head: ({ loaderData }) => {
    const awards = loaderData?.awards ?? [];
    const awardTitles = awards.map((award) => award.title);
    const description =
      awardTitles.length > 0
        ? awardTitles.join(", ")
        : "서울시립대학교 유도부 지호";

    const structuredData = createOrganizationData({
      name: "서울시립대학교 유도부 지호",
      description,
      address: {
        addressCountry: "KR",
        addressLocality: "서울특별시",
        addressRegion: "동대문구",
        postalCode: "02504",
        streetAddress: SITE.practice.address,
        extendedAddress: SITE.practice.place,
      },
      openingHours: [
        {
          dayOfWeek: ["Monday", "Wednesday", "Friday"],
          opens: "18:00",
          closes: "20:00",
        },
      ],
      url: CANONICAL_DOMAIN,
      logo: `${CANONICAL_DOMAIN}/favicon-96x96.png`,
      foundingDate: "1985",
      email: "uosjudojiho@gmail.com",
      sameAs: ["https://www.instagram.com/uos_judo"],
      sport: "유도 (Judo)",
      memberOf: {
        name: "서울시립대학교 (University of Seoul)",
      },
      award: awardTitles,
      geo: {
        latitude: 37.5837,
        longitude: 127.0594,
      },
      includeLocalBusiness: true,
    });

    return seoHead({
      title: "Home",
      description,
      imgUrl: BGImageWebp,
      pathname: "/",
      structuredData,
    });
  },
  component: HomePage,
});
