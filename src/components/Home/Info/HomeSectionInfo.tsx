import styled from "styled-components";
import BGImage from "../../../assets/images/background-img-event.jpg";
import MobileRowColLayout from "../../../layouts/MobileRowColLayout";
import Row from "../../../layouts/Row";
import SheetWrapper from "../../../layouts/SheetWrapper";
import HomeSectionBG from "../HomeSectionBG";
import HomeAwards from "./HomeAwards";
import HomeInfo from "./HomeInfo";

const Container = styled.div`
  color: ${(props) => props.theme.bgColor};
`;

function HomeSectionInfo() {
  return (
    <>
      <HomeSectionBG bgImageSrc={BGImage} id="sectionInfo">
        <SheetWrapper>
          <Container>
            <MobileRowColLayout rowJustifyContent="space-between">
              <HomeInfo />
              <HomeAwards />
            </MobileRowColLayout>
          </Container>
        </SheetWrapper>
      </HomeSectionBG>
    </>
  );
}

export default HomeSectionInfo;
