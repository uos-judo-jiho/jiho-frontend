import React from "react";
import HomeSectionBG from "../HomeSectionBG";
import BGImage from "../../../assets/images/demo3.jpg";

import styled from "styled-components";
import { Link } from "react-router-dom";
import SheetWrapper from "../../../layouts/SheetWrapper";
import Title from "../../../layouts/Title";
import OutlineButton from "../../OutlineButton";
import ExerciseThumbnail from "./ExerciseThumbnail";
import ExerciseVideo from "./ExerciseVideo";

const Container = styled.div`
  position: relative;
`;

function HomeSectionExercise() {
  return (
    <HomeSectionBG bgImageSrc={BGImage} id="sectionExercise">
      <SheetWrapper>
        <Title title={"훈련 일지"} />
        <Container>
          <ExerciseThumbnail imgSrc={""} dateTime={""} />
          <ExerciseVideo />
        </Container>
      </SheetWrapper>
    </HomeSectionBG>
  );
}

export default HomeSectionExercise;
