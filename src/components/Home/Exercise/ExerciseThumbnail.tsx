import { Link } from "react-router-dom";
import styled from "styled-components";
import TrainingLogDatas from "../../../assets/jsons/trainingLog.json";
import OutlineButton from "../../Buttons/OutlineButton";

const Stack = styled.div`
  width: 40vw;

  position: relative;

  @media (max-width: 539px) {
    width: 100%;
  }
`;

const ThumbnailTitle = styled.h3`
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: ${(props) => props.theme.subTitleFontSize};
  color: ${(props) => props.theme.textColor};
`;

const BtnWrapper = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  @media (max-width: 539px) {
    display: none;
  }
`;

const Thumbnail = styled.img`
  width: inherit;
  height: inherit;
`;

function ExerciseThumbnail() {
  const thumbnailData =
    TrainingLogDatas.trainingLogs[TrainingLogDatas.trainingLogs.length - 1];
  return (
    <Link to={"/Photo"}>
      <Stack>
        <ThumbnailTitle>{thumbnailData.dateTime}</ThumbnailTitle>
        <BtnWrapper>
          <OutlineButton text={"자세히보기"} />
        </BtnWrapper>
        <Thumbnail
          // TODO dev API
          src={require("../../../assets/images/trainingLog/" +
            thumbnailData.imgSrcs[0])}
        />
      </Stack>
    </Link>
  );
}

export default ExerciseThumbnail;
