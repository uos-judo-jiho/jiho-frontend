import { useEffect } from "react";

import HomeSectionExercise from "@/components/Home/Exercise/HomeSectionExercise";
import HomeSectionInfo from "@/components/Home/Info/HomeSectionInfo";
import HomeSectionMain from "@/components/Home/Main/HomeSectionMain";
import HomeSectionMore from "@/components/Home/More/HomeSectionMore";
import HomeSectionNews from "@/components/Home/News/HomeSectionNews";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ScrollSnap from "@/components/layouts/ScrollSnap";

import { useNotices } from "@/recoils/notices";
import { useNews } from "@/recoils/news";

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
      <ScrollSnap>
        <DefaultLayout>
          <HomeSectionMain />
          <HomeSectionInfo />
          <HomeSectionNews />
          <HomeSectionExercise />
          <HomeSectionMore />
        </DefaultLayout>
      </ScrollSnap>
    </>
  );
};

export default Home;
