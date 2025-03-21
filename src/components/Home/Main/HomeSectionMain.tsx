import BGImage from "@/lib/assets/images/background-img-group.jpg";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import HomeSectionBG from "../HomeSectionBG";

import HomeTitle from "./HomeTitle";

function HomeSectionMain() {
  return (
    <>
      <HomeSectionBG bgImageSrc={BGImage} id="sectionMain">
        <SheetWrapper>
          <HomeTitle />
        </SheetWrapper>
      </HomeSectionBG>
    </>
  );
}

export default HomeSectionMain;
