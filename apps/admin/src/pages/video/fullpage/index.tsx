import { ArrowLeft, ChevronRight, Film } from "lucide-react";
import { Link } from "react-router-dom";

import { RouterUrl } from "@/app/routers/router-url";
import { useVideoJobs } from "@/features/video/hooks";

const formatDate = (value: string) =>
  new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const VideoFullpageListPage = () => {
  const { data: jobs, isLoading, isError } = useVideoJobs();
  const availableJobs = jobs?.filter(
    (job) => job.status === "done" && job.highlightCount > 0,
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            to={RouterUrl.영상.목록}
            aria-label="관리자 영상 목록으로"
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold sm:text-xl">
              하이라이트 전체화면
            </h1>
            <p className="text-sm text-neutral-500">
              작업할 영상을 선택하세요.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {isLoading && (
          <p className="py-12 text-center text-neutral-500">
            영상 목록을 불러오는 중...
          </p>
        )}
        {isError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            영상 목록을 불러오지 못했습니다.
          </p>
        )}
        {availableJobs?.length === 0 && (
          <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
            <Film className="mx-auto h-9 w-9 text-neutral-400" />
            <p className="mt-3 text-neutral-600">
              라벨링 가능한 영상이 없습니다.
            </p>
          </div>
        )}
        {availableJobs && availableJobs.length > 0 && (
          <ul className="grid gap-3 md:grid-cols-2">
            {availableJobs.map((job) => (
              <li key={job.id}>
                <Link
                  to={RouterUrl.영상.풀페이지.상세({ jobId: job.id })}
                  className="group flex h-full items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-bold text-neutral-600">
                    #{job.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-neutral-900">
                      {job.originalFilename}
                    </span>
                    <span className="mt-1 block text-sm text-neutral-500">
                      하이라이트 {job.highlightCount}개 ·{" "}
                      {formatDate(job.createdAt)}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-neutral-700" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
