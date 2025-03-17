import { useTrainings } from "@/recoills/tranings";
import styled from "styled-components";
import { Constants } from "@/lib/constant";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { useNews } from "../../../recoills/news";
import { useNotices } from "../../../recoills/notices";
import MoreCard from "./MoreCard";

const Container = styled.div``;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 24px;

  width: 100%;

  padding-top: 20px;
`;

const HomeSectionMore = () => {
  const { news } = useNews();
  const { trainings } = useTrainings();
  const { notices } = useNotices();

  return (
    <SheetWrapper>
      <Container>
        <Title title={"게시글 전체보기"} color={Constants.LOGO_BLACK} />
        <GridContainer>
          <MoreCard title="공지사항" linkTo="/notice" data={notices} />
          <MoreCard title="훈련일지" linkTo="/photo" data={trainings || []} />
          <MoreCard
            title="지호지"
            linkTo={`/news/${Constants.LATEST_NEWS_YEAR}`}
            data={news[0]?.articles || []}
          />
        </GridContainer>
      </Container>
    </SheetWrapper>
  );
};

export default HomeSectionMore;
