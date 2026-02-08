import FormContainer from "@/components/admin/form/FormContainer";
import Col from "@/components/layouts/Col";
import Row from "@/components/layouts/Row";
import { useAllNewsQuery } from "@/features/api/news/query";
import { Link, useNavigate } from "react-router-dom";

const GalleryIndex = () => {
  const navigate = useNavigate();
  const { data: news = [] } = useAllNewsQuery();

  const galleries = news
    .map((newsData) => ({
      year: newsData.year,
      imageCount: newsData.images.length,
    }))
    .sort((a, b) => (a.year > b.year ? -1 : 1));

  return (
    <FormContainer title="지호지 갤러리 - 년도 선택">
      <Row justifyContent="space-between" style={{ marginBottom: "12px" }}>
        <button
          onClick={() => navigate("/news")}
          className="px-4 py-2 bg-transparent border border-gray-500 rounded cursor-pointer text-sm transition-all hover:bg-gray-200"
        >
          ← 지호지 관리로 돌아가기
        </button>
      </Row>

      <Col gap={12}>
        <p style={{ margin: 0, color: "#666" }}>
          갤러리를 관리할 년도를 선택해주세요
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-5">
          {galleries.map((gallery) => (
            <Link
              to={`/news/${gallery.year}/gallery`}
              key={gallery.year}
              style={{ textDecoration: "none" }}
            >
              <div className="p-6 border border-gray-500 rounded-lg bg-gray-50 transition-all cursor-pointer hover:border-blue-500 hover:-translate-y-0.5">
                <h2 className="text-lg leading-normal m-0 text-gray-800">
                  {gallery.year}년
                </h2>
                <p className="text-sm m-0 mt-2 text-gray-500">
                  {gallery.imageCount > 0
                    ? `${gallery.imageCount}개의 이미지`
                    : "이미지 없음"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Col>
    </FormContainer>
  );
};

export default GalleryIndex;
