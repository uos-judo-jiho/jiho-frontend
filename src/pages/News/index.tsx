import styled from "styled-components";
import NewsDetail from "./NewsDetail";
import NewsMobile from "./NewsMobile";

const NewsBranch = styled.div`
  & > :first-child {
    @media (max-width: 539px) {
      display: none;
    }
  }

  & > :last-child {
    @media (min-width: 540px) {
      display: none;
    }
  }
`;

const NewsPage = () => {
  return (
    <NewsBranch>
      <NewsDetail />
      <NewsMobile />
    </NewsBranch>
  );
};

export default NewsPage;
