import { useVideoHighlights, useVideoJobs, useNextJobPrefetch } from "@/hooks/use-highlights";
import { useOrientationMode } from "@/hooks/use-orientation";
import { ChevronDown, ChevronUp, Loader2, Smartphone } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OnboardingOverlay, useOnboarding } from "@/components/onboarding-overlay";
import { ShortsCard } from "@/components/shorts-card";
import { VideoPreloader } from "@/components/video-preloader";
import { cn } from "@/lib/utils";

export const ShortsPage = () => {
  const { mode: orientationMode, toggle: toggleOrientation } = useOrientationMode();
  const { needsOnboarding, complete } = useOnboarding();
  const [searchParams, setSearchParams] = useSearchParams();

  // Capture initial URL params once — refs are stable across renders
  const initialJobId = useRef(searchParams.get("jobId"));
  const initialHighlightId = useRef(searchParams.get("highlightId"));
  // Skip restoration phase if there are no URL params to restore
  const [urlInitialized, setUrlInitialized] = useState(
    !initialJobId.current && !initialHighlightId.current,
  );

  const jobsQuery = useVideoJobs();
  const jobs = jobsQuery.data ?? [];

  const [jobIndex, setJobIndex] = useState(0);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const currentJob = jobs[jobIndex];
  const { highlights, isLoading, isError } = useVideoHighlights(currentJob?.id ?? 0);

  const unlabeledHighlights = useMemo(
    () => highlights.filter((h) => !h.isLabeledByCurrentUser),
    [highlights],
  );

  const allHighlights = highlights;
  const activeHighlights = unlabeledHighlights.length > 0 ? unlabeledHighlights : allHighlights;
  const activeHighlight = activeHighlights[highlightIndex];

  // Restore jobIndex from URL once jobs load
  useEffect(() => {
    if (urlInitialized || !initialJobId.current || jobs.length === 0) return;
    const idx = jobs.findIndex((j) => String(j.id) === initialJobId.current);
    if (idx !== -1) setJobIndex(idx);
    if (!initialHighlightId.current) setUrlInitialized(true);
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- one-time restore from URL once jobs load
  }, [jobs, urlInitialized]);

  // Restore highlightIndex from URL once highlights for the target job load
  useEffect(() => {
    if (urlInitialized || !initialHighlightId.current || activeHighlights.length === 0) return;
    const idx = activeHighlights.findIndex((h) => String(h.id) === initialHighlightId.current);
    if (idx !== -1) setHighlightIndex(idx);
    setUrlInitialized(true);
  }, [activeHighlights, urlInitialized]);

  // Sync URL to current state; replace: true keeps the history stack clean
  useEffect(() => {
    if (!urlInitialized) return;
    const job = jobs[jobIndex];
    const highlight = activeHighlights[highlightIndex];
    if (!job || !highlight) return;
    setSearchParams(
      { jobId: String(job.id), highlightId: String(highlight.id) },
      { replace: true },
    );
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- jobs/activeHighlights are derived arrays; indices drive the sync
  }, [urlInitialized, jobIndex, highlightIndex, jobs, activeHighlights, setSearchParams]);

  // 다음 2개 클립 URL — 현재 job 내 남은 것 + 다음 job 첫 번째
  const preloadUrls = useMemo(() => {
    const urls: string[] = [];
    for (let i = highlightIndex + 1; i <= highlightIndex + 2 && i < activeHighlights.length; i++) {
      urls.push(activeHighlights[i].clipUrl);
    }
    return urls;
  }, [activeHighlights, highlightIndex]);

  // 마지막 2개 하이라이트 진입 시 다음 job 데이터 prefetch
  useNextJobPrefetch(jobs, jobIndex, highlightIndex, activeHighlights.length);

  const moveToNext = useCallback(() => {
    const nextIndex = highlightIndex + 1;
    if (nextIndex < activeHighlights.length) {
      setHighlightIndex(nextIndex);
    } else {
      const nextJobIndex = jobIndex + 1;
      if (nextJobIndex < jobs.length) {
        setJobIndex(nextJobIndex);
        setHighlightIndex(0);
      }
    }
  }, [activeHighlights.length, highlightIndex, jobIndex, jobs.length]);

  // 위/아래 스와이프용 — 라벨 없이 이전 클립으로 이동. 잡 첫 클립이면 이전 잡 첫 클립으로.
  const moveToPrev = useCallback(() => {
    if (highlightIndex > 0) {
      setHighlightIndex(highlightIndex - 1);
    } else if (jobIndex > 0) {
      setJobIndex(jobIndex - 1);
      setHighlightIndex(0);
    }
  }, [highlightIndex, jobIndex]);

  if (jobsQuery.isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-sm text-neutral-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (jobsQuery.isError) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <p className="text-lg font-semibold">데이터를 불러오지 못했어요.</p>
        <p className="text-sm text-neutral-400">
          로그인 상태를 확인하고 새로고침해주세요.
        </p>
        <a
          href="/login"
          className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold hover:bg-indigo-400"
        >
          로그인하러 가기
        </a>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 bg-black px-6 text-center text-white">
        <p className="text-lg font-semibold">라벨링할 영상이 없어요</p>
        <p className="text-sm text-neutral-400">영상이 업로드되면 알려드릴게요.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (isError || !activeHighlight) {
    const isAllDone = !isError && allHighlights.length > 0 && unlabeledHighlights.length === 0;
    const hasNextJob = jobIndex + 1 < jobs.length;

    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        {isAllDone ? (
          <>
            <div className="text-5xl">🎉</div>
            <p className="text-xl font-bold">이 영상 완료!</p>
            <p className="text-sm text-neutral-400">
              {currentJob?.originalFilename}의 모든 하이라이트를 라벨링했어요.
            </p>
            {hasNextJob ? (
              <button
                type="button"
                onClick={() => {
                  setJobIndex((prev) => prev + 1);
                  setHighlightIndex(0);
                }}
                className="mt-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold hover:bg-indigo-400"
              >
                다음 영상으로
              </button>
            ) : (
              <p className="mt-2 text-sm text-green-400 font-medium">모든 영상 완료! 수고하셨어요 🥋</p>
            )}
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">하이라이트를 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-white/10 px-6 py-3 text-sm hover:bg-white/20"
            >
              새로고침
            </button>
          </>
        )}
      </div>
    );
  }

  const progress = highlights.length > 0
    ? Math.round(((highlights.length - unlabeledHighlights.length) / highlights.length) * 100)
    : 0;

  return (
    <div className="relative h-dvh overflow-hidden bg-black">
      {needsOnboarding && <OnboardingOverlay onDone={complete} />}

      {/* 가로 <-> 세로 모드 전환 */}
      <button
        type="button"
        onClick={toggleOrientation}
        aria-label={orientationMode === "landscape" ? "세로 모드로 전환" : "가로 모드로 전환"}
        className="absolute right-[calc(var(--safe-right)+1rem)] top-[calc(var(--safe-top)+1.5rem)] z-30 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-60 backdrop-blur-sm transition-opacity hover:opacity-100"
      >
        <Smartphone
          className={cn("h-4 w-4", orientationMode === "landscape" && "rotate-90")}
        />
        {orientationMode === "landscape" ? "세로" : "가로"}
      </button>
      <div className="absolute inset-x-0 top-[var(--safe-top)] z-30 h-0.5 bg-white/10">
        <div
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {jobs.length > 1 && (
        <div className="absolute left-[calc(var(--safe-left)+1rem)] top-[calc(var(--safe-top)+1.5rem)] z-30 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              if (jobIndex > 0) {
                setJobIndex((prev) => prev - 1);
                setHighlightIndex(0);
              }
            }}
            disabled={jobIndex === 0}
            className={cn(
              "rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-opacity",
              jobIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-60 hover:opacity-100",
            )}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (jobIndex < jobs.length - 1) {
                setJobIndex((prev) => prev + 1);
                setHighlightIndex(0);
              }
            }}
            disabled={jobIndex >= jobs.length - 1}
            className={cn(
              "rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-opacity",
              jobIndex >= jobs.length - 1 ? "opacity-0 pointer-events-none" : "opacity-60 hover:opacity-100",
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      <ShortsCard
        key={activeHighlight.id}
        highlight={activeHighlight}
        jobId={currentJob.id}
        index={highlightIndex}
        total={activeHighlights.length}
        onLabeled={moveToNext}
        onNext={moveToNext}
        onPrev={moveToPrev}
      />

      <VideoPreloader urls={preloadUrls} />
    </div>
  );
};
