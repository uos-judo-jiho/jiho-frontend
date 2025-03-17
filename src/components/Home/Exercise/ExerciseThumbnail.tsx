import { Card } from "@/components/ui/card";
import { useTrainings } from "@/recoills/tranings";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Col from "@/components/layouts/Col";

const Stack = styled.div`
  width: 100%;

  border-radius: inherit;

  position: relative;

  @media (max-width: 539px) {
    width: 100%;
  }
`;

const Container = styled(Card)`
  max-width: 640px;
  margin: auto;
  position: relative;
  box-shadow: 0 0.4rem 0.8rem 0 rgba(0, 0, 0, 0.2);
  padding: 0;

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
    margin-bottom: 4px;
  }
`;

const Thumbnail = styled.img`
  width: inherit;
  height: inherit;

  border-radius: inherit;

  ${Container}:hover & {
    filter: brightness(50%);
  }

  @media (max-width: 539px) {
    filter: brightness(50%);
  }
`;

const ExerciseThumbnail = () => {
  const { trainings } = useTrainings();

  const lastTraningData = trainings[0];

  if (!lastTraningData) return null;

  return (
    <Container className="rounded-xl border-none">
      <Link to={`/photo/${lastTraningData.id}`} className="rounded-xl">
        <Stack>
          <Thumbnail src={lastTraningData.imgSrcs[0]} />
          <HoveredContainer>
            <Col justifyContent="center" alignItems="center">
              <HoveredSpan>훈련 일지</HoveredSpan>
              <HoveredSpan>{lastTraningData.dateTime}</HoveredSpan>
              <HoveredSpan fontSize={"1.2rem"}>자세히 보기</HoveredSpan>
            </Col>
          </HoveredContainer>
        </Stack>
      </Link>
    </Container>
  );
};

export default ExerciseThumbnail;
