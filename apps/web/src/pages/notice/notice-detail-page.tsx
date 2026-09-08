import { Link, getRouteApi, linkOptions } from "@tanstack/react-router";

import {
  ArticleNeighbours,
  ContentMeta,
  toNeighbour,
  useBoardDetail,
} from "@/features/content";
import { LikeButton } from "@/features/reaction";
import { Markdown } from "@/shared/ui/markdown";
import { Tag } from "@/shared/ui/tag";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/notice/$id");

const linkTo = (id: number) =>
  linkOptions({ to: "/notice/$id", params: { id: String(id) } });

/**
 * 공지 상세.
 *
 * 이전에는 공지 목록 전체를 받아 그 안에서 현재 글을 찾았다. 이제 종류를 가리지
 * 않는 단건 엔드포인트가 앞뒤 글까지 함께 준다 (api#41).
 * 없는 id·다른 게시판의 id 는 라우트 loader 가 notFound 로 걸러낸다.
 */
export const NoticeDetailPage = () => {
  const { id } = routeApi.useParams();

  const notice = useBoardDetail(Number(id));

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

        <div className="flex justify-center">
          <LikeButton boardId={Number(notice.id)} />
        </div>

        <ArticleNeighbours
          newer={toNeighbour(notice.next, linkTo, "다음 공지")}
          older={toNeighbour(notice.prev, linkTo, "이전 공지")}
        />

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
