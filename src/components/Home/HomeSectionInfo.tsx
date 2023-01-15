import React from "react";
import HomeSectionBG from "./HomeSectionBG";
import BGImage from "../../assets/images/demo1.jpg";
function HomeSectionInfo() {
  return (
    <>
      <HomeSectionBG bgImageSrc={BGImage} id="sectionInfo">
        <div></div>
      </HomeSectionBG>
    </>
  );
}

export default HomeSectionInfo;
