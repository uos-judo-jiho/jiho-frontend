import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";

import Footer from "@/components/common/Footer/footer";
import Navbar from "@/components/common/Navbar/Navbar";
import HomeSectionExercise from "@/components/Home/Exercise/HomeSectionExercise";
import HomeSectionInfo from "@/components/Home/Info/HomeSectionInfo";
import HomeSectionMain from "@/components/Home/Main/HomeSectionMain";
import HomeSectionMore from "@/components/Home/More/HomeSectionMore";
import HomeSectionNews from "@/components/Home/News/HomeSectionNews";
import ScrollSnap from "@/components/layouts/ScrollSnap";

import { useNoticesQuery } from "@/api/notices/query";

import { useNews } from "@/recoils/news";

import MyHelmet from "@/helmet/MyHelmet";
import { awardsData } from "@/lib/assets/data/awards";
import { Constants } from "@/lib/constant";
import { lightTheme } from "@/lib/theme/theme";
import { StructuredData, createOrganizationData } from "@/seo";

const Home = () => {
  const [isDark, setIsDark] = useState(false);

  // React Query hooks - 자동으로 데이터 fetch
  useNoticesQuery();

  const { fetch: fetchNews } = useNews();

  // 클라이언트에서만 API 호출 (SSR 최적화)
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchNews(Constants.LATEST_NEWS_YEAR);
    }
  }, [fetchNews]);

  // Create structured data for organization
  const structuredData = useMemo(() => {
    const currentUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://uosjudo.com";

    const awardTitles = awardsData.awards.map((award) => award.title);
    const description = awardTitles.join(", ");

    return createOrganizationData({
      name: "서울시립대학교 유도부 지호",
      description,
      url: currentUrl,
      logo: `${currentUrl}/favicon-96x96.png`,
      foundingDate: "1985",
      email: "uosjudojiho@gmail.com",
      sameAs: ["https://www.instagram.com/uos_judo"],
      sport: "유도 (Judo)",
      memberOf: {
        name: "서울시립대학교 (University of Seoul)",
      },
      award: awardTitles,
    });
  }, []);

  // Create helmet metadata
  const metaDescription = awardsData.awards.map((award) => award.title).join(", ");

  return (
    <ThemeProvider theme={lightTheme}>
      <MyHelmet
        title="서울시립대학교 유도부 지호 | Home"
        description={metaDescription}
        imgUrl="/favicon-96x96.png"
      />
      <StructuredData data={structuredData} />

      <Navbar isDark={isDark} />
      <ScrollSnap setIsDark={setIsDark}>
        <HomeSectionMain />
        <HomeSectionInfo />
        <HomeSectionNews />
        <HomeSectionExercise />
        <HomeSectionMore />
        <Footer />
      </ScrollSnap>
    </ThemeProvider>
  );
};

export default Home;
