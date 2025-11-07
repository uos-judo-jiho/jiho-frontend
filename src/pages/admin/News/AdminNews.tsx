import { Link, useParams, useNavigate } from "react-router-dom";
import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import ListContainer from "@/components/layouts/ListContainer";
import Row from "@/components/layouts/Row";
import { useNewsQuery } from "@/api/news/query";
import styled from "styled-components";

const BackButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.greyColor};
  border-radius: 4px;
  cursor: pointer;
  font-size: ${(props) => props.theme.defaultFontSize};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.lightGreyColor};
  }
`;

const AdminNews = () => {
  const navigate = useNavigate();
  const { year } = useParams<{ year: string }>();
  const { data: newsData, refetch } = useNewsQuery(year || "2025");

  const articles = newsData?.articles || [];

  return (
    <FormContainer title={`지호지 관리 (${year}년)`}>
      <Row justifyContent="space-between" style={{ marginBottom: "12px" }}>
        <BackButton onClick={() => navigate("/admin/news")}>
          ← 년도 선택으로 돌아가기
        </BackButton>
      </Row>
      <Row justifyContent="space-between">
        <Row gap={12} style={{ width: "auto" }}>
          <Link to={`/admin/news/${year}/write`}>
            <NewArticleButton>새 글쓰기</NewArticleButton>
          </Link>
          <Link to={`/admin/news/${year}/gallery`}>
            <NewArticleButton>{year}년 갤러리 보기</NewArticleButton>
          </Link>
        </Row>
        <NewArticleButton onClick={() => refetch()}>
          새로고침
        </NewArticleButton>
      </Row>
      <ListContainer
        datas={articles}
        targetUrl={`/admin/news/${year}/`}
        additionalTitle={true}
      ></ListContainer>
    </FormContainer>
  );
};

export default AdminNews;
