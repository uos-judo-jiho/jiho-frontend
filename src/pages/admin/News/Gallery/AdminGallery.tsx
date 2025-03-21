import FormContainer from "@/components/admin/form/FormContainer";
import Carousel from "@/components/layouts/Carousel";
import Col from "@/components/layouts/Col";
import Row from "@/components/layouts/Row";
import LeftArrow from "@/lib/assets/svgs/arrow_forward_ios.svg";
import { useNews } from "@/recoils/news";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const YearTitle = styled.h3`
  font-size: ${(props) => props.theme.subTitleFontSize};
  line-height: ${(props) => props.theme.subTitleLineHeight};
`;

const LinkHelpText = styled.span`
  font-size: ${(props) => props.theme.defaultFontSize};
  line-height: ${(props) => props.theme.defaultLineHeight};
  color: ${(props) => props.theme.greyColor};
`;

const EmptyImageText = styled.div`
  padding: 16px;

  font-size: ${(props) => props.theme.defaultFontSize};
  line-height: ${(props) => props.theme.defaultLineHeight};
  font-weight: bold;
  text-align: center;
`;

const ForwardArrow = styled.img`
  width: 20px;
`;

const AdminGallery = () => {
  const { news, refreshNew } = useNews();

  const galleries = news
    .map((newsData) => ({
      year: newsData.year,

      images: newsData.images,
    }))
    .sort((a, b) => (a.year > b.year ? -1 : 1));

  useEffect(() => {
    refreshNew();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <ForwardArrow src={LeftArrow} />
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
