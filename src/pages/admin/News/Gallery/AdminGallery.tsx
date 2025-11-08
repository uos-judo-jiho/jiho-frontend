import FormContainer from "@/components/admin/form/FormContainer";
import Carousel from "@/components/layouts/Carousel";
import Col from "@/components/layouts/Col";
import Row from "@/components/layouts/Row";
import { Link, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useNewsQuery } from "@/api/news/query";

const EditButton = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: ${(props) => props.theme.primaryColor};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: ${(props) => props.theme.defaultFontSize};
  transition: all 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.8;
    scale: 0.98;
  }
`;

const EmptyImageText = styled.div`
  padding: 16px;

  font-size: ${(props) => props.theme.defaultFontSize};
  line-height: ${(props) => props.theme.defaultLineHeight};
  font-weight: bold;
  text-align: center;
`;

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

const AdminGallery = () => {
  const navigate = useNavigate();
  const { year } = useParams<{ year: string }>();
  const { data: newsData } = useNewsQuery(year || "2025");

  const images = newsData?.images || [];

  return (
    <FormContainer title={`지호지 갤러리 관리 (${year}년)`}>
      <Row justifyContent="space-between" style={{ marginBottom: "12px" }}>
        <BackButton onClick={() => navigate(`/admin/news/${year}`)}>
          ← {year}년 게시판으로 돌아가기
        </BackButton>
      </Row>
      <Col gap={20}>
        <EditButton to={`/admin/news/${year}/gallery/write`}>
          갤러리 이미지 수정하기
        </EditButton>
        {images.length > 0 ? (
          <Carousel datas={images} />
        ) : (
          <EmptyImageText>해당 년도 사진이 없습니다</EmptyImageText>
        )}
      </Col>
    </FormContainer>
  );
};

export default AdminGallery;
