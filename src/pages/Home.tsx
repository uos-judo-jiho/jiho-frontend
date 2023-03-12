import HomeSectionExercise from "../components/Home/Exercise/HomeSectionExercise";
import HomeSectionInfo from "../components/Home/Info/HomeSectionInfo";
import HomeSectionMain from "../components/Home/Main/HomeSectionMain";
import HomeSectionNews from "../components/Home/News/HomeSectionNews";
import MyHelmet from "../helmet/MyHelmet";
import DefaultLayout from "../layouts/DefaultLayout";
import ScrollSnap from "../layouts/ScrollSnap";

function Home() {
  return (
    <>
      <MyHelmet helmet="Home" />
      <ScrollSnap>
        <DefaultLayout>
          <HomeSectionMain />
          <HomeSectionInfo />
          <HomeSectionNews />
          <HomeSectionExercise />
        </DefaultLayout>
      </ScrollSnap>
    </>
  );
}

export default Home;
