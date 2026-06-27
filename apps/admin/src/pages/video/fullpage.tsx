import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ListVideo,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { RouterUrl } from "@/app/routers/router-url";
import { Button } from "@/components/ui/button";
import {
  useVideoEvents,
  useVideoJobDetail,
  useVideoJobs,
} from "@/features/video/hooks";
import { FullpageNavigationPanel } from "@/features/video/ui/fullpage-navigation-panel";
import { HighlightLabelCard } from "@/features/video/ui/highlight-label-card";

export const VideoLabelingFullpage = () => {
  const { jobId: jobIdParam } = useParams<{ jobId: string }>();
  const jobId = Number(jobIdParam);
  const navigate = useNavigate();
  const [isListOpen, setIsListOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedHighlightId = Number(searchParams.get("highlightId"));

  const jobQuery = useVideoJobDetail(jobId);
  const eventsQuery = useVideoEvents(jobId);
  const jobsQuery = useVideoJobs();

  const navigableJobs = useMemo(
    () =>
      [...(jobsQuery.data ?? [])]
        .filter((job) => job.status === "done" && job.highlightCount > 0)
        .sort((left, right) => left.id - right.id),
    [jobsQuery.data],
  );
  const currentJobIndex = navigableJobs.findIndex((job) => job.id === jobId);
  const previousJob =
    currentJobIndex > 0 ? navigableJobs[currentJobIndex - 1] : undefined;
  const nextJob =
    currentJobIndex >= 0 && currentJobIndex < navigableJobs.length - 1
      ? navigableJobs[currentJobIndex + 1]
      : undefined;
  const previousJobEventsQuery = useVideoEvents(previousJob?.id ?? 0);
  const nextJobEventsQuery = useVideoEvents(nextJob?.id ?? 0);

  const highlights = useMemo(() => {
    if (!jobQuery.data || !eventsQuery.data) return [];
    const eventStatus = new Map(
      eventsQuery.data.map((event) => [
        event.highlightId,
        event.isLabeledByCurrentUser,
      ]),
    );
    return jobQuery.data.highlights.map((highlight) => ({
      ...highlight,
      isLabeledByCurrentUser: eventStatus.get(highlight.id) ?? false,
    }));
  }, [eventsQuery.data, jobQuery.data]);

  const requestedIndex = highlights.findIndex(
    (highlight) => highlight.id === requestedHighlightId,
  );
  const firstUnlabeledIndex = highlights.findIndex(
    (highlight) => !highlight.isLabeledByCurrentUser,
  );
  const activeIndex =
    requestedIndex >= 0
      ? requestedIndex
      : firstUnlabeledIndex >= 0
        ? firstUnlabeledIndex
        : 0;
  const activeHighlight = highlights[activeIndex];

  const labeledCount = highlights.filter(
    (highlight) => highlight.isLabeledByCurrentUser,
  ).length;
  const isCurrentJobComplete =
    highlights.length > 0 && labeledCount === highlights.length;

  useEffect(() => {
    if (activeHighlight && requestedIndex < 0) {
      setSearchParams(
        { highlightId: String(activeHighlight.id) },
        { replace: true },
      );
    }
  }, [activeHighlight, requestedIndex, setSearchParams]);

  const openHighlight = (highlightId: number, replace = false) => {
    setSearchParams({ highlightId: String(highlightId) }, { replace });
  };

  const openNextJob = () => {
    if (!nextJob) return;
    navigate(RouterUrl.영상.풀페이지.상세({ jobId: nextJob.id }), {
      replace: true,
    });
  };

  const openJob = (targetJobId: number) => {
    setIsListOpen(false);
    if (targetJobId === jobId) return;
    navigate(RouterUrl.영상.풀페이지.상세({ jobId: targetJobId }));
  };

  const openJobHighlight = (
    targetJobId: number,
    highlightId: number,
    replace = false,
  ) => {
    navigate(
      `${RouterUrl.영상.풀페이지.상세({ jobId: targetJobId })}?highlightId=${highlightId}`,
      { replace },
    );
  };

  const previousJobLastHighlight = previousJobEventsQuery.data?.at(-1);
  const nextJobFirstHighlight = nextJobEventsQuery.data?.[0];
  const canMovePrevious = activeIndex > 0 || !!previousJobLastHighlight;
  const canMoveNext =
    activeIndex < highlights.length - 1 || !!nextJobFirstHighlight;

  const movePrevious = () => {
    if (activeIndex > 0) {
      openHighlight(highlights[activeIndex - 1].id);
    } else if (previousJob && previousJobLastHighlight) {
      openJobHighlight(previousJob.id, previousJobLastHighlight.highlightId);
    }
  };

  const moveNext = () => {
    if (activeIndex < highlights.length - 1) {
      openHighlight(highlights[activeIndex + 1].id);
    } else if (nextJob && nextJobFirstHighlight) {
      openJobHighlight(nextJob.id, nextJobFirstHighlight.highlightId);
    }
  };

  const selectHighlight = (highlightId: number) => {
    setIsListOpen(false);
    openHighlight(highlightId);
  };

  const handleSaved = () => {
    const remainingHighlights = [
      ...highlights.slice(activeIndex + 1),
      ...highlights.slice(0, activeIndex),
    ];
    const nextHighlight = remainingHighlights.find(
      (highlight) => !highlight.isLabeledByCurrentUser,
    );

    if (nextHighlight) {
      openHighlight(nextHighlight.id, true);
      return;
    }
    openNextJob();
  };

  const isLoading =
    jobQuery.isLoading || eventsQuery.isLoading || jobsQuery.isLoading;
  const isError = jobQuery.isError || eventsQuery.isError || jobsQuery.isError;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 text-sm text-neutral-600">
        라벨링 데이터를 불러오는 중...
      </div>
    );
  }

  if (isError || !jobQuery.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-100 px-6 text-center text-neutral-900">
        <p>영상 라벨링 데이터를 불러오지 못했습니다.</p>
        <Button asChild variant="secondary">
          <Link to={RouterUrl.영상.풀페이지.목록}>목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to={RouterUrl.영상.풀페이지.목록}
              aria-label="하이라이트 전체화면 목록으로"
              className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold sm:text-base">
                {jobQuery.data.originalFilename}
              </h1>
              <p className="text-xs text-neutral-500">
                완료 {labeledCount}/{highlights.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsListOpen(true)}
              className="mr-1 inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 lg:hidden"
            >
              <ListVideo className="h-4 w-4" />
              <span className="hidden sm:inline">목록</span>
            </button>
            <button
              type="button"
              aria-label="이전 하이라이트"
              disabled={!canMovePrevious}
              onClick={movePrevious}
              className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-14 text-center text-sm tabular-nums">
              {highlights.length > 0 ? activeIndex + 1 : 0}/{highlights.length}
            </span>
            <button
              type="button"
              aria-label="다음 하이라이트"
              disabled={!canMoveNext}
              onClick={moveNext}
              className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-3 py-4 sm:px-6 sm:py-6">
        {highlights.length === 0 ? (
          <section className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
            <ListVideo className="mx-auto h-8 w-8 text-neutral-400" />
            <p className="mt-3 text-neutral-600">
              라벨링할 하이라이트가 없습니다.
            </p>
            {nextJob && (
              <Button className="mt-4" onClick={openNextJob}>
                다음 작업으로 이동
              </Button>
            )}
          </section>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <section className="min-w-0">
              {isCurrentJobComplete &&
                activeHighlight.isLabeledByCurrentUser && (
                  <div className="mb-4 flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 sm:flex-row sm:items-center sm:justify-between">
                    <span>이 영상의 모든 하이라이트를 라벨링했습니다.</span>
                    {nextJob ? (
                      <Button size="sm" onClick={openNextJob}>
                        다음 작업으로 이동
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="secondary">
                        <Link to={RouterUrl.영상.풀페이지.목록}>
                          목록으로 돌아가기
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              <HighlightLabelCard
                key={activeHighlight.id}
                index={activeIndex}
                highlight={activeHighlight}
                jobId={jobId}
                onSaved={handleSaved}
              />
              <nav
                aria-label="하이라이트 이동"
                className="mt-4 flex items-center justify-between gap-3"
              >
                <Button
                  type="button"
                  variant="outline"
                  disabled={!canMovePrevious}
                  onClick={movePrevious}
                  className="bg-white"
                >
                  <ChevronLeft />
                  이전 하이라이트
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!canMoveNext}
                  onClick={moveNext}
                  className="bg-white"
                >
                  다음 하이라이트
                  <ChevronRight />
                </Button>
              </nav>
            </section>

            <aside className="hidden lg:block">
              <FullpageNavigationPanel
                jobs={navigableJobs}
                currentJobId={jobId}
                highlights={highlights}
                activeIndex={activeIndex}
                onSelectJob={openJob}
                onSelectHighlight={selectHighlight}
                className="sticky top-24 max-h-[calc(100vh-7rem)]"
              />
            </aside>
          </div>
        )}
      </main>

      {isListOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="목록 닫기"
            onClick={() => setIsListOpen(false)}
            className="absolute inset-0 bg-black/30"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="라벨링 목록"
            className="absolute inset-y-0 right-0 w-[min(22rem,calc(100vw-2rem))] bg-white p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900">라벨링 목록</h2>
              <button
                type="button"
                aria-label="목록 닫기"
                onClick={() => setIsListOpen(false)}
                className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FullpageNavigationPanel
              jobs={navigableJobs}
              currentJobId={jobId}
              highlights={highlights}
              activeIndex={activeIndex}
              onSelectJob={openJob}
              onSelectHighlight={selectHighlight}
              className="max-h-[calc(100vh-5rem)] border-0 p-0 shadow-none"
            />
          </aside>
        </div>
      )}
    </div>
  );
};
