import FormContainer from "@/components/admin/form/FormContainer";
import Col from "@/components/layouts/Col";
import Row from "@/components/layouts/Row";
import { useNews } from "@/recoils/news";
import { Link, useNavigate } from "react-router-dom";
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
    transform: translateY(-2px);
  }
`;

const YearTitle = styled.h2`
  font-size: ${(props) => props.theme.subTitleFontSize};
  line-height: ${(props) => props.theme.subTitleLineHeight};
  margin: 0;
  color: ${(props) => props.theme.textColor};
`;

const ImageCount = styled.p`
  font-size: ${(props) => props.theme.defaultFontSize};
  margin: 8px 0 0 0;
  color: ${(props) => props.theme.greyColor};
`;

const YearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
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

const AdminGalleryIndex = () => {
  const navigate = useNavigate();
  const { news } = useNews();

  const galleries = news
    .map((newsData) => ({
      year: newsData.year,
      imageCount: newsData.images.length,
    }))
    .sort((a, b) => (a.year > b.year ? -1 : 1));

  return (
    <FormContainer title="지호지 갤러리 - 년도 선택">
      <Row justifyContent="space-between" style={{ marginBottom: "12px" }}>
        <BackButton onClick={() => navigate("/admin/news")}>
          ← 지호지 관리로 돌아가기
        </BackButton>
      </Row>

      <Col gap={12}>
        <p style={{ margin: 0, color: "#666" }}>
          갤러리를 관리할 년도를 선택해주세요
        </p>
        <YearGrid>
          {galleries.map((gallery) => (
            <Link
              to={`/admin/news/${gallery.year}/gallery`}
              key={gallery.year}
              style={{ textDecoration: "none" }}
            >
              <YearCard>
                <YearTitle>{gallery.year}년</YearTitle>
                <ImageCount>
                  {gallery.imageCount > 0
                    ? `${gallery.imageCount}개의 이미지`
                    : "이미지 없음"}
                </ImageCount>
              </YearCard>
            </Link>
          ))}
        </YearGrid>
      </Col>
    </FormContainer>
  );
};

export default AdminGalleryIndex;
