import HomeSectionExercise from "../components/Home/HomeSectionExercise";
import HomeSectionInfo from "../components/Home/HomeSectionInfo";
import HomeSectionMain from "../components/Home/HomeSectionMain";
import HomeSectionNews from "../components/Home/HomeSectionNews";
import Navbar from "../components/Navbar/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <HomeSectionMain />
      <HomeSectionInfo />
      <HomeSectionNews />
      <HomeSectionExercise />
    </>
  );
}

export default Home;
