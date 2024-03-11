import styled from "styled-components";
import { Constants } from "../../../constant/constant";
import SheetWrapper from "../../../layouts/SheetWrapper";
import Title from "../../../layouts/Title";
import MoreCard from "./MoreCard";
import { useNews } from "../../../recoills/news";
import { useTrainings } from "../../../recoills/tranings";
import { useEffect } from "react";
import { useNotices } from "../../../recoills/notices";

const Container = styled.div``;

const GridContainer = styled.div`
  display: grid;
  width: 100%;

  padding-top: 2rem;

  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  @media (max-width: 539px) {
    grid-template-columns: none;
    grid-template-rows: repeat(3, 1fr);
  }
`;

function HomeSectionMore() {
  const { news } = useNews();
  const { trainings } = useTrainings();
  const { notices } = useNotices();

  return (
    <SheetWrapper>
      <Container>
        <Title title={"게시글 전체보기"} color={Constants.LOGO_BLACK} />
        <GridContainer>
          <MoreCard title="공지사항" linkTo="/notice" data={notices} />
          <MoreCard title="훈련일지" linkTo="/photo" data={trainings} />
          <MoreCard
            title="지호지"
            linkTo="/news/2022"
            data={news[0]?.articles || []}
          />
        </GridContainer>
      </Container>
    </SheetWrapper>
  );
}

export default HomeSectionMore;
