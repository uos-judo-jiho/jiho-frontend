import heroJpg from "@/shared/lib/assets/images/background-img-group.jpg";
import heroWebp from "@/shared/lib/assets/images/background-img-group.webp";
import { SITE } from "@/shared/config/site";

/**
 * 홈 히어로.
 *
 * 이전 홈은 6개의 100vh 섹션을 `scroll-snap-type: y mandatory` 로 묶어 한 번
 * 스크롤할 때마다 한 화면씩 넘어갔다. 스크롤을 가로채는 데다 섹션 인덱스와
 * 헤더 색이 배열 순서로 결합돼 있어(0=main, 5=footer …) 섹션을 하나 추가하면
 * 깨지는 구조였다. 지금은 평범하게 이어지는 문서로 바꾸고, 첫 화면만 크게 잡았다.
 */
export const HomeHero = () => (
  <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-inverse">
    <picture className="absolute inset-0 -z-10">
      <source srcSet={heroWebp} type="image/webp" />
      <img
        src={heroJpg}
        alt=""
        // 히어로는 LCP 요소이므로 지연 로딩하지 않는다.
        // React 18 은 camelCase fetchPriority 를 모르므로 소문자로 넘긴다.
        {...({ fetchpriority: "high" } as Record<string, string>)}
        className="size-full object-cover"
      />
    </picture>
    <div aria-hidden className="jd-scrim-full absolute inset-0 -z-10" />

    <div className="mx-auto w-full max-w-page px-gutter pt-header pb-16 sm:pb-24">
      <p className="jd-eyebrow text-on-inverse-muted">{SITE.since}</p>

      <h1 className="mt-5 max-w-[16ch] text-display text-on-inverse">
        서울시립대학교
        <br />
        유도부 지호
      </h1>

      <p className="mt-6 max-w-prose text-lead text-on-inverse-muted">{SITE.nameEn}</p>

      <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-inverse-line pt-6">
        <div>
          <dt className="jd-eyebrow text-on-inverse-muted">{SITE.practice.label}</dt>
          <dd className="mt-1.5 text-caption text-on-inverse">{SITE.practice.time}</dd>
        </div>
        <div>
          <dt className="jd-eyebrow text-on-inverse-muted">장소</dt>
          <dd className="mt-1.5 text-caption text-on-inverse">{SITE.practice.place}</dd>
        </div>
      </dl>
    </div>
  </section>
);
