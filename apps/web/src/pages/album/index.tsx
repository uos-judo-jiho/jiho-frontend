import Footer from "@/components/common/Footer/footer";
import { LazyImage } from "@/components/common/image/lazy-image";
import MobileHeader from "@/components/common/MobileHeader/MobileHeader";
import DetailImageModal from "@/components/common/Modals/DetailImageModal/DetailImageModal";
import ResponsiveBranch from "@/components/common/ResponsiveBranch/ResponsiveBranch";
import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import { v2Api } from "@packages/api";
import { Suspense, useState } from "react";

export const AlbumPage = () => {
  return (
    <Suspense fallback={<SkeletonItem />}>
      <Responsive />
    </Suspense>
  );
};

const Responsive = () => {
  return (
    <ResponsiveBranch
      pcComponent={
        <DefaultLayout>
          <SheetWrapper>
            <Inner />
          </SheetWrapper>
        </DefaultLayout>
      }
      mobileComponent={
        <div className="min-h-screen flex flex-col px-2">
          <MobileHeader subTitle="앨범" />
          <div className="flex-1">
            <Inner />
          </div>
          <Footer />
        </div>
      }
    />
  );
};

const Inner = () => {
  const { data } = v2Api.useGetApiV2NewsImagesAllSuspense({
    query: {
      select: (response) => response.data,
    },
  });

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [detailImageSrc, setDetailImageSrc] = useState<string | null>(null);

  const handleOpenDetailModal = (src: string) => {
    setDetailImageSrc(src);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setDetailImageSrc(null);
    setOpenDetailModal(false);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {data?.map(({ images, year }) => {
          return (
            <div key={year} className="m-0 break-inside-avoid">
              <h2 className="text-md font-bold mb-4">{year}년</h2>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-4">
                {images.map((image) => (
                  <button
                    onClick={() => handleOpenDetailModal(image)}
                    key={image}
                    className="w-full h-auto mb-2 md:mb-4 cursor-pointer"
                  >
                    <LazyImage
                      src={image}
                      alt={`${year}년 사진 ${image}`}
                      className="relative aspect-auto"
                    />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {detailImageSrc && (
        <DetailImageModal
          image={detailImageSrc}
          isOpen={openDetailModal}
          onClose={handleCloseDetailModal}
        />
      )}
    </>
  );
};
