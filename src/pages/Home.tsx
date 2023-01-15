import Footer from "../components/Footer/footer";
import HomeSectionCards from "../components/Home/HomeSectionCards";
import HomeSectionExercise from "../components/Home/HomeSectionExercise";
import HomeSectionInfo from "../components/Home/HomeSectionInfo";
import HomeSectionMain from "../components/Home/HomeSectionMain";
import HomeSectionNews from "../components/Home/HomeSectionNews";
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
