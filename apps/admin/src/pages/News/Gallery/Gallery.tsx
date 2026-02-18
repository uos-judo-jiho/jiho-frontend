import FormContainer from "@/components/admin/form/FormContainer";
import DetailImageModal from "@/components/common/Modals/DetailImageModal/DetailImageModal";
import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import Col from "@/components/layouts/Col";
import { v2Api } from "@packages/api";
import { Suspense, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Gallery = () => {
  const { year } = useParams<{ year: string }>();
  const { data: gallery } = v2Api.useGetApiV2NewsYearImagesSuspense(
    Number(year),
    {
      query: {
        select: (response) => response.data,
      },
    },
  );

  const images = gallery.images || [];

  return (
    <FormContainer title={`지호지 갤러리 관리 (${year}년)`}>
      <Suspense fallback={<SkeletonItem />}>
        <Col gap={20}>
          <Link
            to={`/news/${year}/gallery/write`}
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded no-underline text-sm transition-all mb-5 hover:opacity-90 active:opacity-80 active:scale-[0.98]"
          >
            갤러리 이미지 수정하기
          </Link>
          {images.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.map((imgSrc, index) => (
                <GalleryImage key={`${imgSrc}-${index}`} src={imgSrc} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm leading-normal font-bold text-center">
              해당 년도 사진이 없습니다
            </div>
          )}
        </Col>
      </Suspense>
    </FormContainer>
  );
};

const GalleryImage = ({ src }: { src: string }) => {
  const [detailIsOpen, setDetailIsOpen] = useState(false);

  return (
    <>
      <button
        key={src}
        className="w-full bg-gray-200 overflow-hidden"
        onClick={() => setDetailIsOpen(true)}
      >
        <img
          src={src}
          alt={`Gallery ${src.split("/").pop()}`}
          className="w-full h-full object-cover"
        />
      </button>

      <DetailImageModal
        image={src}
        title={`갤러리 이미지 ${src.split("/").pop()}`}
        isOpen={detailIsOpen}
        onClose={() => setDetailIsOpen(false)}
      />
    </>
  );
};

export default Gallery;
