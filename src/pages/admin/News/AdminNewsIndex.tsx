import { Link } from "react-router-dom";
import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import Row from "@/components/layouts/Row";
import Col from "@/components/layouts/Col";
import { vaildNewsYearList } from "@/lib/utils/Utils";
import styled from "styled-components";

const YearCard = styled.div`
  padding: 24px;
  border: 1px solid ${(props) => props.theme.greyColor};
  border-radius: 8px;
  background-color: ${(props) => props.theme.bgColor};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const YearTitle = styled.h2`
  font-size: ${(props) => props.theme.subTitleFontSize};
  line-height: ${(props) => props.theme.subTitleLineHeight};
  margin: 0;
  color: ${(props) => props.theme.textColor};
`;

const YearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const AdminNewsIndex = () => {
  const yearList = vaildNewsYearList().reverse(); // 최신 년도가 먼저 오도록

  return (
    <FormContainer title="지호지 관리 - 년도 선택">
      <Row justifyContent="space-between" style={{ marginBottom: "20px" }}>
        <Link to="/admin/news/gallery">
          <NewArticleButton>년도별 갤러리 보기</NewArticleButton>
        </Link>
      </Row>

      <Col gap={12}>
        <p style={{ margin: 0, color: "#666" }}>
          관리하실 년도를 선택해주세요
        </p>
        <YearGrid>
          {yearList.map((year) => (
            <Link
              to={`/admin/news/${year}`}
              key={year}
              style={{ textDecoration: "none" }}
            >
              <YearCard>
                <YearTitle>{year}년</YearTitle>
              </YearCard>
            </Link>
          ))}
        </YearGrid>
      </Col>
    </FormContainer>
  );
};

export default AdminNewsIndex;
