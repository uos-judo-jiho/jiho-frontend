import HomeSectionExercise from "../components/Home/Exercise/HomeSectionExercise";
import HomeSectionInfo from "../components/Home/Info/HomeSectionInfo";
import HomeSectionCards from "../components/Home/Main/HomeSectionCards";
import HomeSectionMain from "../components/Home/Main/HomeSectionMain";
import HomeSectionNews from "../components/Home/News/HomeSectionNews";
import StickyButton from "../components/StickyButton";
import DefaultLayout from "../layouts/DefaultLayout";

function Home() {
  return (
    <>
      <DefaultLayout>
        <HomeSectionMain />
        <HomeSectionCards />
        <HomeSectionInfo />
        <HomeSectionNews />
        <HomeSectionExercise />
      </DefaultLayout>
      <StickyButton />
    </>
  );
}

export default Home;
