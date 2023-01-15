import BGImage from "../../../assets/images/demo.jpg";
import HomeSectionBG from "../HomeSectionBG";

import HomeTitle from "./HomeTitle";

function HomeSectionMain() {
  return (
    <>
      <HomeSectionBG bgImageSrc={BGImage} id="sectionMain">
        <HomeTitle />
      </HomeSectionBG>
    </>
  );
}

export default HomeSectionMain;
