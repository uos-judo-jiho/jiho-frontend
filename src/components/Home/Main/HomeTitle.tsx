import { Card, CardContent, CardTitle } from "@/components/ui/card";
import styled from "styled-components";

const ContainerWrapper = styled.div`
  display: flex;
  margin: 0 0 60px auto;
  padding-top: 60px;

  @media (max-width: 859px) {
    width: 100%;
  }
`;

const Container = styled(Card)`
  padding: 24px;
  position: relative;
  flex: 1;
`;

const SubTitle = styled.h4`
  font-size: ${(props) => props.theme.subTitleFontSize};

  letter-spacing: 7px;
  text-transform: none;
  line-height: 120%;
  font-weight: 400;
  margin: 0;
  color: ${(props) => props.theme.lightGreyColor};
`;

const Title = styled.h1`
  text-transform: uppercase;
  font-family: sans-serif;
  font-size: ${(props) => props.theme.titleFontSize};

  font-weight: 500;

  color: ${(props) => props.theme.lightGreyColor};
`;

function HomeTitle() {
  return (
    <ContainerWrapper>
      <Container className="backdrop-blur-sm bg-white/30 border-none">
        <CardTitle className="flex flex-col gap-4">
          <SubTitle>서울시립대학교 유도부</SubTitle>
          <div className="inline-flex gap-2 items-end">
            <Title>지호</Title>
            <h5 className="text-base">
              {"University of Seoul. Judo Team Jiho"}
            </h5>
          </div>
        </CardTitle>
        <CardContent>
          <div>Since 1985</div>
        </CardContent>
      </Container>
    </ContainerWrapper>
  );
}

export default HomeTitle;
