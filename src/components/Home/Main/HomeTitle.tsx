import { Card, CardTitle } from "@/components/ui/card";
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

function HomeTitle() {
  return (
    <ContainerWrapper>
      <Container className="backdrop-blur-sm bg-white/30 border-none">
        <CardTitle className="flex flex-col gap-4">
          <div className="text-2xl">서울시립대학교 유도부</div>
          <div>
            <div className="text-2xl">지호</div>
            <br />
            <div className="inline-flex gap-2 ">
              {"University of Seoul. Judo Team Jiho"}
            </div>
          </div>
        </CardTitle>
        <div className="text-base">Since 1985</div>
      </Container>
    </ContainerWrapper>
  );
}

export default HomeTitle;
