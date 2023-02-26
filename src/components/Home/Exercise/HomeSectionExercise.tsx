import BGImage from "../../../assets/images/background-img-training.jpg";
import HomeSectionBG from "../HomeSectionBG";

import styled from "styled-components";
import SheetWrapper from "../../../layouts/SheetWrapper";
import Title from "../../../layouts/Title";
import ExerciseThumbnail from "./ExerciseThumbnail";
import ExerciseVideo from "./ExerciseVideo";

const Container = styled.div`
  width: 100%;
  position: relative;
`;

function HomeSectionExercise() {
  return (
    <HomeSectionBG bgImageSrc={BGImage} id="sectionExercise">
      <SheetWrapper>
        {/* <Title title={"지호 운동"} /> */}
        <Container>
          <ExerciseThumbnail />
          {/* <ExerciseVideo /> */}
        </Container>
      </SheetWrapper>
    </HomeSectionBG>
  );
}

export default HomeSectionExercise;
