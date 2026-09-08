import { LoadMoreButton, useBoardList } from "@/features/content";
import { TrainingGrid } from "@/features/training";
import { PageHeader } from "@/shared/ui/page-header";
import { PageShell } from "@/widgets/page-shell";

/**
 * 훈련일지 목록.
 *
 * 예전에는 전체를 한 번에 받아 화면에서 날짜순으로 정렬했다. 이제 서버가
 * 최신순으로 페이지 단위로 주므로(api#41) 정렬은 필요 없고, 뒷 페이지는
 * "더 보기"로 이어 붙인다.
 */
export const TrainingIndexPage = () => {
  const { items, total, hasMore, isLoadingMore, loadMore } = useBoardList({
    type: "training",
  });

  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow="Training"
          title="훈련일지"
          description="정규 운동과 교류전 등 훈련기록을 남깁니다."
          action={
            <span
              data-numeric
              className="text-caption text-ink-subtle tabular-nums"
            >
              총 {total}건
            </span>
          }
        />
        <TrainingGrid trainings={items} />
        {hasMore && (
          <LoadMoreButton onClick={loadMore} loading={isLoadingMore}>
            훈련일지 더 보기
          </LoadMoreButton>
        )}
      </div>
    </PageShell>
  );
};
