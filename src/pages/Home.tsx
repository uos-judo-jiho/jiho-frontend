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

function Home() {
  const { fetch: fetchNotices } = useNotices();
  const { fetch: fetchrainings } = useTrainings();
  const { fetch: fetchNews } = useNews();

  useEffect(() => {
    fetchNotices();
    fetchrainings();
    fetchNews();
  }, []);

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
}

export default Home;
