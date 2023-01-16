import React from "react";
import HomeSectionBG from "../HomeSectionBG";
import BGImage from "../../../assets/images/demo3.jpg";

import styled from "styled-components";
import { Link } from "react-router-dom";
import SheetWrapper from "../../../layouts/SheetWrapper";
import Title from "../../../layouts/Title";
import OutlineButton from "../../OutlineButton";
import ExerciseThumbnail from "./ExerciseThumbnail";

function HomeSectionExercise() {
  return (
    <HomeSectionBG bgImageSrc={BGImage} id="sectionExercise">
      <SheetWrapper>
        <Title title={"훈련 일지"} />
        <ExerciseThumbnail imgSrc={""} dateTime={""} />
      </SheetWrapper>
    </HomeSectionBG>
  );
}

export default HomeSectionExercise;
