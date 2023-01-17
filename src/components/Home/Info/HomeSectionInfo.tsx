import BGImage from "../../../assets/images/demo1.jpg";
import Row from "../../../layouts/Row";
import SheetWrapper from "../../../layouts/SheetWrapper";
import HomeSectionBG from "../HomeSectionBG";
import HomeInfo from "./HomeInfo";

function HomeSectionInfo() {
  return (
    <>
      <HomeSectionBG bgImageSrc={BGImage} id="sectionInfo">
        <SheetWrapper>
          <Row>
            <HomeInfo />
          </Row>
        </SheetWrapper>
      </HomeSectionBG>
    </>
  );
}

export default HomeSectionInfo;
