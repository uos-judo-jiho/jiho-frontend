import BGImage from "../../../assets/images/demo1.jpg";
import Row from "../../../layouts/Row";
import SheetWrapper from "../../../layouts/SheetWrapper";
import HomeSectionBG from "../HomeSectionBG";
import HomeAwards from "./HomeAwards";
import HomeInfo from "./HomeInfo";

function HomeSectionInfo() {
  return (
    <>
      <HomeSectionBG bgImageSrc={""} id="sectionInfo">
        <SheetWrapper>
          <Row justifyContent="space-between">
            <HomeInfo />
            <HomeAwards />
          </Row>
        </SheetWrapper>
      </HomeSectionBG>
    </>
  );
}

export default HomeSectionInfo;
