import BGImage from "@/shared/lib/assets/images/background-img-group.jpg";
import BGImageWebp from "@/shared/lib/assets/images/background-img-group.webp";

import SheetWrapper from "@/components/layouts/SheetWrapper";
import HomeSectionBG from "../HomeSectionBG";

import HomeTitle from "./HomeTitle";

function HomeSectionMain() {
  return (
    <>
      <HomeSectionBG
        bgImageSrc={BGImage}
        bgImageSrcWebp={BGImageWebp}
        bgImageAlt="main-background"
        id="sectionMain"
      >
        <SheetWrapper>
          <HomeTitle />
        </SheetWrapper>
      </HomeSectionBG>
    </>
  );
}

export default HomeSectionMain;
