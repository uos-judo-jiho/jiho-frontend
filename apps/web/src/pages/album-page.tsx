import { v2Api } from "@packages/api";
import type { v2ApiModel } from "@packages/api/model";
import { useState } from "react";

import { Image } from "@/shared/ui/image";
import { Lightbox } from "@/shared/ui/lightbox";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionHeading } from "@/shared/ui/section-heading";
import { PageShell } from "@/widgets/page-shell";

type LightboxState = { src: string; alt: string } | null;

/** 앨범이 한 번에 보여주는 연도 수 */
export const ALBUM_YEAR_LIMIT = 20;

/** 연도마다 접힌 상태에서 보여주는 미리보기 사진 수 */
export const ALBUM_PREVIEW_PER_YEAR = 12;

/** 한 해를 펼칠 때 받는 최대 장수 (서버 상한) */
const YEAR_IMAGE_LIMIT = 200;

/**
 * 연도별 사진 앨범.
 *
 * 예전에는 모든 연도의 사진을 한 응답으로 전부 받았다. 갤러리가 별도
 * 엔드포인트로 갈라지면서(api#41) 연도 목록에는 미리보기만 싣고, 그 해 전체는
 * 눌렀을 때만 받는다.
 */
export const AlbumPage = () => {
  const { data: album } = v2Api.useListGalleriesSuspense(
    { limit: ALBUM_YEAR_LIMIT, perYear: ALBUM_PREVIEW_PER_YEAR },
    { query: { select: (response) => response.data } },
  );

  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const total = album.items.reduce((sum, year) => sum + year.imageCount, 0);

  return (
    <PageShell>
      <div className="flex flex-col gap-14">
        <PageHeader
          eyebrow="Album"
          title="지호 앨범"
          action={
            <span
              data-numeric
              className="text-caption text-ink-subtle tabular-nums"
            >
              총 {total.toLocaleString()}장
            </span>
          }
        />

        {album.items.map((year) => (
          <AlbumYear key={year.year} year={year} onOpen={setLightbox} />
        ))}
      </div>

      <Lightbox
        src={lightbox?.src ?? null}
        alt={lightbox?.alt}
        onClose={() => setLightbox(null)}
      />
    </PageShell>
  );
};

type AlbumYearProps = {
  year: v2ApiModel.GalleryYear;
  onOpen: (lightbox: LightboxState) => void;
};

const AlbumYear = ({ year, onOpen }: AlbumYearProps) => {
  const [expanded, setExpanded] = useState(false);

  // 펼치기 전에는 요청하지 않는다. 서버 렌더에서도 항상 접힌 상태이므로
  // 하이드레이션 결과가 어긋나지 않는다.
  const { data: allImages, isFetching } = v2Api.useGetGallery(
    year.year,
    { limit: YEAR_IMAGE_LIMIT },
    {
      query: {
        enabled: expanded,
        select: (response) => response.data.items,
      },
    },
  );

  const images = allImages ?? year.images;
  const rest = year.imageCount - images.length;
  // 펼친 뒤에도 남는 장수(한 해 200장 초과)는 더 받을 방법이 없으므로 버튼을 접는다
  const canExpand = !expanded && rest > 0;

  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        title={`${year.year}년`}
        action={
          <span data-numeric className="text-micro text-ink-faint tabular-nums">
            {year.imageCount.toLocaleString()}장
          </span>
        }
      />

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {images.map((image, index) => {
          const alt = `${year.year}년 지호 사진 ${index + 1}`;
          return (
            <li key={`${image.originSrc}-${index}`}>
              <button
                type="button"
                onClick={() => onOpen({ src: image.originSrc, alt })}
                className="group block w-full overflow-hidden rounded-sm"
              >
                <Image
                  src={image.originSrc}
                  lowResSrc={image.smallSrc}
                  alt={alt}
                  aspect="square"
                  imageClassName="transition-transform duration-500 ease-brand group-hover:scale-[1.05]"
                />
                <span className="sr-only">크게 보기</span>
              </button>
            </li>
          );
        })}
      </ul>

      {canExpand && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            disabled={isFetching}
            aria-busy={isFetching}
            className="rounded-sm border border-line px-5 py-2.5 text-caption font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink-strong disabled:opacity-60"
          >
            {isFetching
              ? "불러오는 중…"
              : `${year.year}년 사진 ${rest.toLocaleString()}장 더 보기`}
          </button>
        </div>
      )}
    </section>
  );
};
