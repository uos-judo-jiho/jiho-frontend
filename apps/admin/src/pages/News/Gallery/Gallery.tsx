import FormContainer from "@/components/admin/form/FormContainer";
import Carousel from "@/components/layouts/Carousel";
import Col from "@/components/layouts/Col";
import Row from "@/components/layouts/Row";
import { normalizeNewsResponse } from "@/shared/lib/api/news";
import { v1Api } from "@packages/api";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Gallery = () => {
  const navigate = useNavigate();
  const { year } = useParams<{ year: string }>();
  const { data: response } = v1Api.useGetApiV1NewsYear(Number(year), {
    query: {
      enabled: Boolean(year),
      select: (result) => result.data,
    },
  });

  const newsData = useMemo(
    () => normalizeNewsResponse(response, year ?? ""),
    [response, year],
  );

  const images = newsData?.images || [];

  return (
    <FormContainer title={`지호지 갤러리 관리 (${year}년)`}>
      <Row justifyContent="space-between" style={{ marginBottom: "12px" }}>
        <button
          onClick={() => navigate(`/news/${year}`)}
          className="px-4 py-2 bg-transparent border border-gray-500 rounded cursor-pointer text-sm transition-all hover:bg-gray-200"
        >
          ← {year}년 게시판으로 돌아가기
        </button>
      </Row>
      <Col gap={20}>
        <Link
          to={`/news/${year}/gallery/write`}
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded no-underline text-sm transition-all mb-5 hover:opacity-90 active:opacity-80 active:scale-[0.98]"
        >
          갤러리 이미지 수정하기
        </Link>
        {images.length > 0 ? (
          <Carousel datas={images} />
        ) : (
          <div className="p-4 text-sm leading-normal font-bold text-center">
            해당 년도 사진이 없습니다
          </div>
        )}
      </Col>
    </FormContainer>
  );
};

export default Gallery;
