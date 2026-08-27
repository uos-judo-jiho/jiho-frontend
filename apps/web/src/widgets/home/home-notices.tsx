import { v2Api } from "@packages/api";
import { Link, linkOptions } from "@tanstack/react-router";

import { formatDate } from "@/shared/lib/format";
import { MoreLink } from "@/shared/ui/more-link";
import { SectionHeading } from "@/shared/ui/section-heading";

const PREVIEW_COUNT = 5;

/** 공지사항 미리보기. */
export const HomeNotices = () => {
  const { data: notices = [] } = v2Api.useGetApiV2NoticesSuspense(undefined, {
    query: { select: (response) => response.data.notices ?? [] },
  });

  if (notices.length === 0) return null;

  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Notice"
        title="공지사항"
        action={
          <MoreLink link={linkOptions({ to: "/notice" })}>전체 보기</MoreLink>
        }
      />

      <ul className="flex flex-col">
        {notices.slice(0, PREVIEW_COUNT).map((notice) => (
          <li key={notice.id} className="border-b border-line">
            <Link
              {...linkOptions({
                to: "/notice/$id",
                params: { id: String(notice.id) },
              })}
              className="group flex items-baseline justify-between gap-6 py-4.5"
            >
              <span className="jd-clamp-1 text-body font-medium text-ink decoration-accent decoration-2 underline-offset-4 group-hover:underline">
                {notice.title}
              </span>
              <time
                dateTime={notice.dateTime}
                className="shrink-0 text-micro text-ink-subtle tabular-nums"
              >
                {formatDate(notice.dateTime)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
