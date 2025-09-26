import { useEffect, useState } from "react";

import Footer from "@/components/common/Footer/footer";
import Navbar from "@/components/common/Navbar/Navbar";
import HomeSectionExercise from "@/components/Home/Exercise/HomeSectionExercise";
import HomeSectionInfo from "@/components/Home/Info/HomeSectionInfo";
import HomeSectionMain from "@/components/Home/Main/HomeSectionMain";
import HomeSectionMore from "@/components/Home/More/HomeSectionMore";
import HomeSectionNews from "@/components/Home/News/HomeSectionNews";
import ScrollSnap from "@/components/layouts/ScrollSnap";

import { useNews } from "@/recoils/news";
import { useNotices } from "@/recoils/notices";

import MyHelmet from "@/helmet/MyHelmet";

import { Constants } from "@/lib/constant";
import { lightTheme } from "@/lib/theme/theme";
import { ThemeProvider } from "styled-components";

const Home = () => {
  const [isDark, setIsDark] = useState(false);

  const { fetch: fetchNotices } = useNotices();

  const { fetch: fetchNews } = useNews();

  // 클라이언트에서만 API 호출 (SSR 최적화)
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchNews(Constants.LATEST_NEWS_YEAR);
      fetchNotices();
    }
  }, [fetchNews, fetchNotices]);

  return (
    <ThemeProvider theme={lightTheme}>
      <MyHelmet title="Home" />
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
