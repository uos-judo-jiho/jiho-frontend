import BGImage from "@/lib/assets/images/background-img-training.jpg";
import BGImageWebp from "@/lib/assets/images/background-img-training.webp";

import HomeSectionBG from "../HomeSectionBG";

import styled from "styled-components";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import ExerciseThumbnail from "./ExerciseThumbnail";

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const HomeSectionExercise = () => {
  return (
    <HomeSectionBG bgImageSrc={BGImage} bgImageSrcWebp={BGImageWebp} bgImageAlt="exercise-background" id="sectionExercise">
      <SheetWrapper>
        <Container>
          <ExerciseThumbnail />
          {/* <ExerciseVideo /> */}
        </Container>
      </SheetWrapper>
    </HomeSectionBG>
  );
};

export default HomeSectionExercise;
