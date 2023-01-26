import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import OutlineButton from "../../OutlineButton";
import ThumbnailImg from "../../../assets/images/demo.jpg";

type ExerciseThumbnailProps = {
  imgSrc: string;
  dateTime: string;
};

const Stack = styled.div`
  width: 600px;
  height: auto;
  position: relative;
`;

const ThumbnailTitle = styled.h3`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: ${(props) => props.theme.subTitleFontSize};
`;

const BtnWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const Thumbnail = styled.img`
  width: inherit;
  height: inherit;
`;

function ExerciseThumbnail({ imgSrc, dateTime }: ExerciseThumbnailProps) {
  return (
    <Stack>
      <ThumbnailTitle>2022.10.10</ThumbnailTitle>
      <BtnWrapper>
        <Link to={"/Photo"}>
          <OutlineButton text={"자세히보기"} />
        </Link>
      </BtnWrapper>
      <Thumbnail src={ThumbnailImg} />
    </Stack>
  );
}

export default ExerciseThumbnail;
