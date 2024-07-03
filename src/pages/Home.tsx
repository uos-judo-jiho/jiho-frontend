import { useEffect } from "react";
import HomeSectionExercise from "../components/Home/Exercise/HomeSectionExercise";
import HomeSectionInfo from "../components/Home/Info/HomeSectionInfo";
import HomeSectionMain from "../components/Home/Main/HomeSectionMain";
import HomeSectionMore from "../components/Home/More/HomeSectionMore";
import HomeSectionNews from "../components/Home/News/HomeSectionNews";
import MyHelmet from "../helmet/MyHelmet";
import DefaultLayout from "../layouts/DefaultLayout";
import ScrollSnap from "../layouts/ScrollSnap";
import { useNews } from "../recoills/news";
import { useNotices } from "../recoills/notices";
import { useTrainings } from "../recoills/tranings";
import { Constants } from "../constant/constant";

const Home = () => {
  const { fetch: fetchNotices } = useNotices();
  const { fetch: fetchTrainings } = useTrainings();
  const { fetch: fetchNews } = useNews();

  useEffect(() => {
    fetchNews(Constants.LATEST_NEWS_YEAR);
  }, [fetchNews]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

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
