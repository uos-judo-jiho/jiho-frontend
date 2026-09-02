import { Link } from "@tanstack/react-router";

import { PageShell } from "@/widgets/page-shell";

export const NotFoundPage = () => (
  <PageShell width="prose">
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <p className="jd-eyebrow">404</p>
      <h1 className="text-title text-ink-strong">존재하지 않는 페이지입니다</h1>
      <p className="text-lead text-ink-muted">
        주소가 바뀌었거나 삭제된 글일 수 있습니다.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-sm bg-ink-strong px-5 py-2.5 text-caption font-semibold text-paper transition-opacity hover:opacity-85"
      >
        홈으로 돌아가기
      </Link>
    </div>
  </PageShell>
);
