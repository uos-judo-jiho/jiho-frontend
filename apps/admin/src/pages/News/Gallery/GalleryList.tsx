import FormContainer from "@/components/admin/form/FormContainer";
import Col from "@/components/layouts/Col";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v2Api } from "@packages/api";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export const GalleryList = () => {
  const galleriesData = useQueries({
    queries: vaildNewsYearList()
      .reverse()
      .map((year) =>
        v2Api.getGetApiV2NewsYearImagesQueryOptions(Number(year), {}),
      ),
  });

  const galleries = galleriesData.map((data) => data?.data?.data);

  return (
    <FormContainer title="지호지 갤러리 - 년도 선택">
      <Col gap={12}>
        <p style={{ margin: 0, color: "#666" }}>
          갤러리를 관리할 년도를 선택해주세요
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-5">
          {galleries.map((gallery) => {
            if (!gallery) return null;
            return (
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
                    {gallery.images.length > 0
                      ? `${gallery.images.length}개의 이미지`
                      : "이미지 없음"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Col>
    </FormContainer>
  );
};
