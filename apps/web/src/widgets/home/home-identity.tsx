import { v2Api } from "@packages/api";

import { AwardList } from "@/features/award";
import { SITE } from "@/shared/config/site";
import { Logo } from "@/shared/ui/logo";

/**
 * 소개 + 수상 이력 2단 구성.
 *
 * 이전에는 MobileRowColLayout 이 children 을 PC용 Row 와 모바일용 Col 에
 * 각각 렌더해서, 이 블록 전체가 DOM 에 두 벌 존재했다. 수상 이력 쿼리도 두 번
 * 실행되고 크롤러에는 같은 내용이 중복 노출됐다. 이제 한 벌만 그린다.
 */
export const HomeIdentity = () => {
  const { data: awards = [] } = v2Api.useGetApiV2AwardsSuspense({
    query: { select: (response) => response.data.awards ?? [] },
  });

  return (
    <section className="grid gap-12 md:grid-cols-2 md:gap-16">
      <div className="flex flex-col gap-6">
        <Logo className="size-16" />
        <div className="flex flex-col gap-3">
          <p className="jd-eyebrow">About</p>
          <h2 className="text-heading text-ink-strong">{SITE.nameKo}</h2>
          <p className="text-lead text-ink-muted">{SITE.nameEn}</p>
        </div>

        <dl className="flex flex-col gap-4 border-t border-line pt-6">
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-caption text-ink-faint">창설</dt>
            <dd className="text-caption text-ink">{SITE.foundingYear}년</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-caption text-ink-faint">
              정규 운동
            </dt>
            <dd className="text-caption text-ink">{SITE.practice.time}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-caption text-ink-faint">장소</dt>
            <dd className="text-caption text-ink">
              {SITE.practice.place}
              <br />
              <span className="text-ink-muted">{SITE.practice.address}</span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <h2 className="text-subheading text-ink-strong">수상 이력</h2>
          <span data-numeric className="text-micro text-ink-faint tabular-nums">
            {awards.length}건
          </span>
        </div>
        <AwardList awards={awards} limitOnMobile={4} />
      </div>
    </section>
  );
};
