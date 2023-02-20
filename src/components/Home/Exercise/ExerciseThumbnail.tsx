import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import OutlineButton from "../../Buttons/OutlineButton";
import ThumbnailImg from "../../../assets/images/demo.jpg";
import TrainingLogDatas from "../../../assets/jsons/trainingLog.json";

const Stack = styled.div`
  width: 40vw;
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

function ExerciseThumbnail() {
  const thumbnailData =
    TrainingLogDatas.trainingLogs[TrainingLogDatas.trainingLogs.length - 1];
  return (
    <Stack>
      <ThumbnailTitle>{thumbnailData.dateTime}</ThumbnailTitle>
      <BtnWrapper>
        <Link to={"/Photo"}>
          <OutlineButton text={"자세히보기"} />
        </Link>
      </BtnWrapper>
      <Thumbnail
        // TODO dev API
        src={require("../../../assets/images/trainingLog/" +
          thumbnailData.imgSrcs[0])}
      />
    </Stack>
  );
}

export default ExerciseThumbnail;
