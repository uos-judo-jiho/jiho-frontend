import { LoadMoreButton, useBoardList } from "@/features/content";
import { NoticeList } from "@/features/notice";
import { PageHeader } from "@/shared/ui/page-header";
import { PageShell } from "@/widgets/page-shell";

export const NoticeIndexPage = () => {
  const { items, hasMore, isLoadingMore, loadMore } = useBoardList({
    type: "notice",
  });

  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow="Notice"
          title="공지사항"
          description="부 운영과 행사에 관한 안내입니다."
        />
        <NoticeList notices={items} />
        {hasMore && (
          <LoadMoreButton onClick={loadMore} loading={isLoadingMore}>
            공지사항 더 보기
          </LoadMoreButton>
        )}
      </div>
    </PageShell>
  );
};
