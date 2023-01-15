import Footer from "../components/Footer/footer";
import HomeSectionExercise from "../components/Home/HomeSectionExercise";
import HomeSectionInfo from "../components/Home/HomeSectionInfo";
import HomeSectionNews from "../components/Home/News/HomeSectionNews";
import HomeSectionCards from "../components/Home/Main/HomeSectionCards";
import HomeSectionMain from "../components/Home/Main/HomeSectionMain";
import Navbar from "../components/Navbar/Navbar";
import StickyButton from "../components/StickyButton";

function Home() {
  return (
    <>
      <Navbar />

      <HomeSectionMain />
      <HomeSectionCards />
      <HomeSectionInfo />
      <HomeSectionNews />
      <HomeSectionExercise />
      <Footer />
      <StickyButton />
    </>
  );
}

export default Home;
