import { RouterUrl } from "@/app/routers/router-url";
import { KebabMenu } from "@/components/ui/kebab-menu";
import { PageHeader } from "@/components/layouts/PageHeader";
import { HighlightLabelCard } from "@/features/video/ui/highlight-label-card";
import {
  useDeleteVideoJob,
  useIsRoot,
  useVideoEvents,
  useVideoJobDetail,
} from "@/features/video/hooks";
import { ArrowLeft, Film } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const VideoLabelingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const navigate = useNavigate();
  const isRoot = useIsRoot();
  const deleteJob = useDeleteVideoJob();

  const { data: job, isLoading, isError } = useVideoJobDetail(jobId);

  const handleDeleteJob = () => {
    if (
      !window.confirm(
        `'${job?.originalFilename ?? "이 영상"}' 영상과 하이라이트·라벨을 모두 삭제할까요? 되돌릴 수 없어요.`,
      )
    )
      return;
    deleteJob.mutate(
      { jobId },
      {
        onSuccess: () => {
          toast.success("영상을 삭제했어요.");
          navigate(RouterUrl.영상.목록);
        },
        onError: () => toast.error("영상 삭제에 실패했어요."),
      },
    );
  };
  const {
    data: events,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useVideoEvents(jobId);
  const labelingStatus = new Map(
    events?.map((event) => [event.highlightId, event.isLabeledByCurrentUser]),
  );

  return (
    <div className="space-y-6 p-6">
      <Link
        to={RouterUrl.영상.목록}
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </Link>

      <PageHeader
        icon={Film}
        title={job?.originalFilename ?? "영상 라벨링"}
        description="각 하이라이트 클립을 보고 라벨을 저장하세요."
        rightElement={
          isRoot && job ? (
            <KebabMenu
              actions={[
                {
                  label: deleteJob.isPending ? "삭제 중…" : "영상 삭제",
                  onSelect: handleDeleteJob,
                  destructive: true,
                  disabled: deleteJob.isPending,
                },
              ]}
            />
          ) : undefined
        }
      />

      {(isLoading || isEventsLoading) && (
        <p className="text-neutral-500">불러오는 중...</p>
      )}
      {(isError || isEventsError) && (
        <p className="text-red-600">
          영상을 불러오지 못했어요. 다시 시도해주세요.
        </p>
      )}

      {job && job.highlights.length === 0 && (
        <p className="text-neutral-500">하이라이트가 없는 영상이에요.</p>
      )}

      {job && events && job.highlights.length > 0 && (
        <div className="flex flex-col gap-4">
          {job.highlights.map((highlight, index) => (
            <HighlightLabelCard
              key={highlight.id}
              index={index}
              highlight={{
                ...highlight,
                isLabeledByCurrentUser:
                  labelingStatus.get(highlight.id) ?? false,
              }}
              jobId={job.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
