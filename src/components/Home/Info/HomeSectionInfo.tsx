import styled from "styled-components";

import BGImage from "@/lib/assets/images/background-img-event.jpg";
import BGImageWebp from "@/lib/assets/images/background-img-event.webp";

import MobileRowColLayout from "@/components/layouts/MobileRowColLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import HomeSectionBG from "../HomeSectionBG";
import HomeAwards from "./HomeAwards";
import HomeInfo from "./HomeInfo";

const Container = styled.div`
  color: ${(props) => props.theme.bgColor};
`;

function HomeSectionInfo() {
  return (
    <>
      <HomeSectionBG bgImageSrc={BGImage} bgImageSrcWebp={BGImageWebp} bgImageAlt="info-background" id="sectionInfo">
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
