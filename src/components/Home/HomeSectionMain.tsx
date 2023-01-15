import styled from "styled-components";
import Col from "../../layouts/Col";
import SheetWrapper from "../../layouts/SheetWrapper";
import HomeCard from "./HomeCard";
import HomeSectionBG from "./HomeSectionBG";
import HomeTitle from "./HomeTitle";
import BGImage from "../../assets/images/demo.jpg";

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
