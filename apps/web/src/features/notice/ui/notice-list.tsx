import { Link, linkOptions } from "@tanstack/react-router";

import type { ContentItem } from "@/shared/lib/types/content";
import { formatDate } from "@/shared/lib/format";
import { EmptyState } from "@/shared/ui/empty-state";

type NoticeListProps = {
  notices: ContentItem[];
};

/**
 * 공지사항 목록.
 *
 * 이전 ListContainer 는 flex 로 만든 가짜 표에 "번호/제목/작성일" 헤더를 두고
 * 행마다 <hr> 을 끼워 넣었다. 게시판 티가 나는 데다 <ul> 안에 <div> 가 들어가
 * 마크업도 어긋나 있었다. 여기서는 괘선으로 구분되는 목록으로 바꾸고,
 * 좁은 화면에서는 메타가 제목 아래로 내려간다.
 */
export const NoticeList = ({ notices }: NoticeListProps) => {
  if (notices.length === 0) {
    return <EmptyState title="등록된 공지사항이 없습니다" />;
  }

  return (
    <ul className="border-t border-line-strong">
      {notices.map((notice) => (
        <li key={notice.id} className="border-b border-line">
          <Link
            {...linkOptions({
              to: "/notice/$id",
              params: { id: String(notice.id) },
            })}
            className="group flex flex-col gap-1.5 py-5 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <span className="text-lead font-semibold text-ink-strong decoration-accent decoration-2 underline-offset-4 group-hover:underline">
              {notice.title}
            </span>
            <span className="flex shrink-0 items-center gap-2 text-micro text-ink-subtle">
              <span>{notice.author}</span>
              <span aria-hidden className="text-ink-faint">
                ·
              </span>
              <time dateTime={notice.dateTime}>
                {formatDate(notice.dateTime)}
              </time>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
