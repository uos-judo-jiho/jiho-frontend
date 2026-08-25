import { useEffect, useState } from "react";

import Footer from "@/components/common/Footer/footer";
import Navbar from "@/components/common/Navbar/Navbar";
import HomeSectionExercise from "@/components/Home/Exercise/HomeSectionExercise";
import HomeSectionInfo from "@/components/Home/Info/HomeSectionInfo";
import HomeSectionMain from "@/components/Home/Main/HomeSectionMain";
import HomeSectionMore from "@/components/Home/More/HomeSectionMore";
import HomeSectionNews from "@/components/Home/News/HomeSectionNews";
import ScrollSnap from "@/components/layouts/ScrollSnap";

import { logger } from "@99mini/logger-client";

const Home = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    logger.info("홈", { path: window.location.pathname });
  }, []);

  return (
    <>
      <Navbar isDark={isDark} />

      <ScrollSnap setIsDark={setIsDark}>
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
