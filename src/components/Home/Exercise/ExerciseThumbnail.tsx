import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getTrainings } from "../../../api/trainingApi";
import useFetchData from "../../../Hooks/useFetchData";
import Col from "../../../layouts/Col";
import { ArticleInfoType } from "../../../types/ArticleInfoType";

const Stack = styled.div`
  width: 100%;

  position: relative;

  @media (max-width: 539px) {
    width: 100%;
  }
`;

const Container = styled.div`
  width: 60%;
  margin: auto;
  position: relative;
  box-shadow: 0 0.4rem 0.8rem 0 rgba(0, 0, 0, 0.2);
  @media (max-width: 539px) {
    width: 100%;
  }
`;

const HoveredContainer = styled.div`
  position: absolute;
  display: none;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  color: ${(props) => props.theme.bgColor};

  ${Container}:hover & {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0.8rem 1.6rem 0 rgba(0, 0, 0, 0.2);
  }
  @media (max-width: 539px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
type HoveredSpanProps = {
  fontSize?: string;
};

const HoveredSpan = styled.span<HoveredSpanProps>`
  font-size: ${(props) =>
    props.fontSize ? props.fontSize : props.theme.descriptionFontSize};

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const Thumbnail = styled.img`
  width: inherit;
  height: inherit;

  ${Container}:hover & {
    filter: brightness(50%);
  }

  @media (max-width: 539px) {
    filter: brightness(50%);
  }
`;

function ExerciseThumbnail() {
  const [thumbnailData, setThumbnailData] = useState<ArticleInfoType>();

  // TODO 훈련일지는 이번 년도 데이터 가져오기
  // 혹은 백에서 가장 최근 데이터만 주기

  const { loading, error, response } = useFetchData(getTrainings, "2022");

  useEffect(() => {
    if (!loading && !error && response) {
      // 가장 최근 데이터만 가져오기
      const data = response.trainingLogs[response.trainingLogs.length - 1];
      setThumbnailData(data);
    }
  }, [loading, error, response]);

  if (!thumbnailData) return null;

  return (
    <Container>
      <Link to={"/Photo"}>
        <Stack>
          <Thumbnail src={thumbnailData.imgSrcs[0]} />
          <HoveredContainer>
            <Col justifyContent="center" alignItems="center">
              <HoveredSpan>훈련 일지</HoveredSpan>
              <HoveredSpan>{thumbnailData.dateTime}</HoveredSpan>
              <HoveredSpan fontSize={"0.5rem"}>자세히 보기</HoveredSpan>
            </Col>
          </HoveredContainer>
        </Stack>
      </Link>
    </Container>
  );
}

export default ExerciseThumbnail;
