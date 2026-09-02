import { v2Api } from "@packages/api";
import { useState } from "react";

import { Image } from "@/shared/ui/image";
import { Lightbox } from "@/shared/ui/lightbox";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionHeading } from "@/shared/ui/section-heading";
import { PageShell } from "@/widgets/page-shell";

/**
 * 연도별 사진 앨범.
 *
 * 이전에는 ResponsiveBranch 로 PC/모바일 트리를 통째로 갈랐는데, 실제 차이는
 * 헤더와 좌우 여백뿐이었다. columns(멀티 컬럼) 대신 grid 를 쓰면서 이미지 순서가
 * 위→아래 흐름으로 바뀌어 읽는 순서와 DOM 순서가 일치한다.
 */
export const AlbumPage = () => {
  const { data: albums = [] } = v2Api.useListNewsGalleriesSuspense({
    query: { select: (response) => response.data },
  });

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  );

  const total = albums.reduce((sum, album) => sum + album.images.length, 0);

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

        {albums.map(({ year, images }) => (
          <section key={year} className="flex flex-col gap-6">
            <SectionHeading
              title={`${year}년`}
              action={
                <span
                  data-numeric
                  className="text-micro text-ink-faint tabular-nums"
                >
                  {images.length.toLocaleString()}장
                </span>
              }
            />

            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {images.map((image, index) => {
                const alt = `${year}년 지호 사진 ${index + 1}`;
                return (
                  <li key={`${image.originSrc}-${index}`}>
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({ src: image.originSrc, alt })
                      }
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
          </section>
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
