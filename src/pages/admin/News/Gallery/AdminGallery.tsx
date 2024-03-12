import { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import FormContainer from "../../../../components/admin/form/FormContainer";
import Carousel from "../../../../layouts/Carousel";
import Col from "../../../../layouts/Col";
import Row from "../../../../layouts/Row";
import { useNews } from "../../../../recoills/news";

const YearTitle = styled.h3`
  font-size: 3.2rem;
`;

const LinkHelpText = styled.span`
  font-size: 2rem;
  color: ${(props) => props.theme.greyColor};
`;

const EmptyImageText = styled.div`
  padding: 16px;

  font-size: 2rem;
  font-weight: bold;
  text-align: center;
`;

const AdminGallery = () => {
  const { news, refreshNew } = useNews();
  const galleries = news.map((newsData) => ({
    year: newsData.year,

    images: newsData.images,
  }));

  useEffect(() => {
    refreshNew();
  }, []);

  return (
    <FormContainer title="지호지 갤러리 관리">
      <Col gap={20}>
        {galleries.map((gallery) => (
          <div key={gallery.year}>
            <Link to={`/admin/news/gallery/write?year=${gallery.year}`}>
              <Row gap={4} alignItems="flex-end">
                <YearTitle>{gallery.year}</YearTitle>
                <LinkHelpText>년 갤러리 수정하기</LinkHelpText>
              </Row>
            </Link>
            {gallery.images.length ? (
              <Carousel datas={gallery.images} />
            ) : (
              <EmptyImageText>해당 년도 사진이 없습니다</EmptyImageText>
            )}
          </div>
        ))}
      </Col>
    </FormContainer>
  );
};

export default AdminGallery;
