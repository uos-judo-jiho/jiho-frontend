import { useEffect } from "react";

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

const Home = () => {
  const { fetch: fetchNotices } = useNotices();

  const { fetch: fetchNews } = useNews();

  useEffect(() => {
    fetchNews(Constants.LATEST_NEWS_YEAR);
  }, [fetchNews]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <>
      <MyHelmet title="Home" />
      <Navbar />
      <ScrollSnap>
        <HomeSectionMain />
        <HomeSectionInfo />
        <HomeSectionNews />
        <HomeSectionExercise />
        <HomeSectionMore />
        <Footer />
      </ScrollSnap>
    </>
  );
};

export default Home;
