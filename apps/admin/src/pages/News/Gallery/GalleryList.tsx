import FormContainer from "@/components/admin/form/FormContainer";
import Col from "@/components/layouts/Col";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v2Api } from "@packages/api";
import { Link } from "@tanstack/react-router";

/**
 * 갤러리 연도 선택.
 *
 * 예전에는 연도마다 갤러리를 따로 불러 사진 수를 셌다. 갤러리 목록 엔드포인트가
 * 연도별 사진 수를 한 번에 주므로(api#41) 호출이 하나로 줄었다.
 *
 * 연도 목록 자체는 여전히 상수에서 온다 — 아직 사진이 한 장도 없는 연도에도
 * 새로 올릴 수 있어야 하기 때문이다.
 */
export const GalleryList = () => {
  const years = vaildNewsYearList().reverse();

  const { data: imageCountByYear } = v2Api.useListGalleries(
    { limit: 100, perYear: 0 },
    {
      query: {
        select: (response) =>
          new Map(
            response.data.items.map((gallery) => [
              String(gallery.year),
              gallery.imageCount,
            ]),
          ),
      },
    },
  );

  return (
    <FormContainer title="지호지 갤러리 - 년도 선택">
      <Col gap={12}>
        <p style={{ margin: 0, color: "#666" }}>
          갤러리를 관리할 년도를 선택해주세요
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-5">
          {years.map((year) => {
            const imageCount = imageCountByYear?.get(year) ?? 0;
            return (
              <Link
                to="/news/$year/gallery"
                params={{ year }}
                key={year}
                style={{ textDecoration: "none" }}
              >
                <div className="p-6 border border-gray-500 rounded-lg bg-gray-50 transition-all cursor-pointer hover:border-blue-500 hover:-translate-y-0.5">
                  <h2 className="text-lg leading-normal m-0 text-gray-800">
                    {year}년
                  </h2>
                  <p className="text-sm m-0 mt-2 text-gray-500">
                    {imageCount > 0
                      ? `${imageCount}개의 이미지`
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
