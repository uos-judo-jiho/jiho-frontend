import { RouterUrl } from "@/app/routers/router-url";
import { PageHeader } from "@/components/layouts/PageHeader";
import { HighlightLabelCard } from "@/features/video/ui/highlight-label-card";
import { useVideoEvents, useVideoJobDetail } from "@/features/video/hooks";
import { ArrowLeft, Film } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export const VideoLabelingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);

  const { data: job, isLoading, isError } = useVideoJobDetail(jobId);
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
