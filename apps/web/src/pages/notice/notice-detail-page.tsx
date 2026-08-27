import { v2Api } from "@packages/api";
import { Link, Navigate, getRouteApi, linkOptions } from "@tanstack/react-router";

import { ContentMeta } from "@/features/content";
import { Markdown } from "@/shared/ui/markdown";
import { Tag } from "@/shared/ui/tag";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/notice/$id");

export const NoticeDetailPage = () => {
  const { id } = routeApi.useParams();

  const { data: notices = [] } = v2Api.useGetApiV2NoticesSuspense(undefined, {
    query: { select: (response) => response.data.notices ?? [] },
  });

  const notice = notices.find((item) => String(item.id) === String(id));

  // Suspense 쿼리라 이 시점에는 이미 로드가 끝나 있다 — 없으면 목록으로.
  if (!notice) return <Navigate to="/notice" replace />;

  return (
    <PageShell width="prose">
      <article className="flex flex-col gap-10">
        <header className="flex flex-col gap-4 border-b border-line-strong pb-8">
          <p className="jd-eyebrow">공지사항</p>
          <h1 className="text-title text-ink-strong">{notice.title}</h1>
          <ContentMeta dateTime={notice.dateTime} author={notice.author} />
          {notice.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-1">
              {notice.tags.map((tag) => (
                <li key={tag}>
                  <Tag>#{tag}</Tag>
                </li>
              ))}
            </ul>
          )}
        </header>

        <Markdown content={notice.description} />

        <footer className="border-t border-line pt-6">
          <Link
            {...linkOptions({ to: "/notice" })}
            className="group inline-flex items-center gap-2 text-caption text-ink-muted transition-colors hover:text-ink-strong"
          >
            <span
              aria-hidden
              className="transition-transform duration-200 ease-brand group-hover:-translate-x-1"
            >
              ←
            </span>
            목록으로
          </Link>
        </footer>
      </article>
    </PageShell>
  );
};
