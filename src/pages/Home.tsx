import HomeSectionExercise from "../components/Home/Exercise/HomeSectionExercise";
import HomeSectionInfo from "../components/Home/Info/HomeSectionInfo";
import HomeSectionCards from "../components/Home/Main/HomeSectionCards";
import HomeSectionMain from "../components/Home/Main/HomeSectionMain";
import HomeSectionNews from "../components/Home/News/HomeSectionNews";
import DefaultLayout from "../layouts/DefaultLayout";
import ScrollSnap from "../layouts/ScrollSnap";

function Home() {
  return (
    <>
      <ScrollSnap>
        <DefaultLayout>
          <HomeSectionMain />
          {/* <HomeSectionCards /> */}
          <HomeSectionInfo />
          <HomeSectionNews />
          <HomeSectionExercise />
        </DefaultLayout>
      </ScrollSnap>
    </>
  );
}

export default Home;
