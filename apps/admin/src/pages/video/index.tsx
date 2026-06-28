import { RouterUrl } from "@/app/routers/router-url";
import { KebabMenu } from "@/components/ui/kebab-menu";
import { PageHeader } from "@/components/layouts/PageHeader";
import {
  type VideoJobListItem,
  type VideoJobStatus,
} from "@/features/video/api";
import {
  useDeleteVideoJob,
  useIsRoot,
  useVideoJobs,
} from "@/features/video/hooks";
import { cn } from "@/shared/lib/utils";
import { ArrowUpRightFromSquareIcon, Expand, Film } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const STATUS_META: Record<
  VideoJobStatus,
  { label: string; className: string }
> = {
  done: { label: "완료", className: "bg-green-100 text-green-700" },
  processing: { label: "처리중", className: "bg-blue-100 text-blue-700" },
  uploaded: { label: "업로드됨", className: "bg-neutral-100 text-neutral-600" },
  failed: { label: "실패", className: "bg-red-100 text-red-700" },
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const VideoLabelingPage = () => {
  const { data: jobs, isLoading, isError } = useVideoJobs();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        icon={Film}
        title="하이라이트 라벨링"
        description="분석된 영상 하이라이트를 검토하고 라벨을 달아요."
        className="justify-normal gap-4"
        rightElement={
          <Link
            to={RouterUrl.영상.풀페이지.목록}
            title="하이라이트 전체화면으로 이동"
          >
            <ArrowUpRightFromSquareIcon className="h-5 w-5 text-neutral-600 transition-colors hover:text-neutral-900" />
          </Link>
        }
      />

      {isLoading && <p className="text-neutral-500">불러오는 중...</p>}
      {isError && (
        <p className="text-red-600">
          목록을 불러오지 못했어요. 다시 시도해주세요.
        </p>
      )}

      {jobs && jobs.length === 0 && (
        <p className="text-neutral-500">아직 등록된 영상이 없어요.</p>
      )}

      {jobs && jobs.length > 0 && (
        <ul className="flex flex-col gap-2">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </ul>
      )}
    </div>
  );
};

const JobRow = ({ job }: { job: VideoJobListItem }) => {
  const status = STATUS_META[job.status];
  const isRoot = useIsRoot();
  const deleteJob = useDeleteVideoJob();

  const handleDelete = () => {
    if (
      !window.confirm(
        `'${job.originalFilename}' 영상과 하이라이트·라벨을 모두 삭제할까요? 되돌릴 수 없어요.`,
      )
    )
      return;
    deleteJob.mutate(
      { jobId: job.id },
      {
        onSuccess: () => toast.success("영상을 삭제했어요."),
        onError: () => toast.error("영상 삭제에 실패했어요."),
      },
    );
  };

  return (
    <li className="flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <Link
        to={RouterUrl.영상.상세({ id: job.id })}
        className="flex min-w-0 flex-1 items-center justify-between transition-colors hover:text-neutral-600"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-semibold text-neutral-900">
            {job.originalFilename}
          </span>
          <span className="text-xs text-neutral-500">
            {formatDate(job.createdAt)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm text-neutral-600">
            하이라이트 {job.highlightCount}개
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>
      </Link>
      {job.status === "done" && job.highlightCount > 0 && (
        <Link
          to={RouterUrl.영상.풀페이지.상세({ jobId: job.id })}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          <Expand className="h-4 w-4" />
          전체화면으로
        </Link>
      )}
      {isRoot && (
        <KebabMenu
          className="self-end sm:self-auto"
          actions={[
            {
              label: deleteJob.isPending ? "삭제 중…" : "영상 삭제",
              onSelect: handleDelete,
              destructive: true,
              disabled: deleteJob.isPending,
            },
          ]}
        />
      )}
    </li>
  );
};
