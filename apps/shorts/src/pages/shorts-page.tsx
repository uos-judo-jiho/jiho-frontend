import {
  OnboardingOverlay,
  useOnboarding,
} from "@/components/onboarding-overlay";
import { ShortsCard } from "@/components/shorts-card";
import { VideoPreloader } from "@/components/video-preloader";
import {
  useNextJobPrefetch,
  useVideoHighlights,
  useVideoJobs,
} from "@/hooks/use-highlights";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

/** 세로 스와이프 중 위/아래에 미리 보이는 이웃 클립(정지 프레임). */
const PreviewClip = ({ url }: { url: string }) => (
  <video
    src={url}
    muted
    playsInline
    preload="auto"
    className="h-full w-full bg-black object-contain"
  />
);

export const ShortsPage = () => {
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
  const { highlights, isLoading, isError } = useVideoHighlights(
    currentJob?.id ?? 0,
  );

  const unlabeledHighlights = useMemo(
    () => highlights.filter((h) => !h.isLabeledByCurrentUser),
    [highlights],
  );

  const allHighlights = highlights;
  const activeHighlights =
    unlabeledHighlights.length > 0 ? unlabeledHighlights : allHighlights;
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
    if (
      urlInitialized ||
      !initialHighlightId.current ||
      activeHighlights.length === 0
    )
      return;
    const idx = activeHighlights.findIndex(
      (h) => String(h.id) === initialHighlightId.current,
    );
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
  }, [
    urlInitialized,
    jobIndex,
    highlightIndex,
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- jobs/activeHighlights are derived arrays; indices drive the sync
    jobs,
    activeHighlights,
    setSearchParams,
  ]);

  // 다음 2개 클립 URL — 현재 job 내 남은 것 + 다음 job 첫 번째
  const preloadUrls = useMemo(() => {
    const urls: string[] = [];
    for (
      let i = highlightIndex + 1;
      i <= highlightIndex + 2 && i < activeHighlights.length;
      i++
    ) {
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

  // ── 세로 페이저(릴스/쇼츠식) — 수직 드래그 시 위/아래 이웃 클립을 미리 보여준다 ──
  const prevHighlight =
    highlightIndex > 0 ? activeHighlights[highlightIndex - 1] : null;
  const nextHighlight =
    highlightIndex + 1 < activeHighlights.length
      ? activeHighlights[highlightIndex + 1]
      : null;
  const canNext =
    highlightIndex + 1 < activeHighlights.length || jobIndex + 1 < jobs.length;
  const canPrev = highlightIndex > 0 || jobIndex > 0;

  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const pendingCommit = useRef<"next" | "prev" | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  // 카드 컨트롤을 포탈할 고정 레이어(피드 transform 밖). 스크롤 시 UI 고정용.
  const [controlsLayer, setControlsLayer] = useState<HTMLDivElement | null>(
    null,
  );

  // 드래그 중: 손가락을 따라 피드가 이동(끝단엔 고무줄 저항).
  const handleVerticalDragMove = useCallback(
    (deltaY: number) => {
      setDragging(true);
      let dy = deltaY;
      if (dy < 0 && !canNext) dy *= 0.25;
      if (dy > 0 && !canPrev) dy *= 0.25;
      setDragY(dy);
    },
    [canNext, canPrev],
  );

  // 임계값 미달로 손을 떼면 원위치로 스냅.
  const handleVerticalDragCancel = useCallback(() => {
    setDragging(false);
    setDragY(0);
  }, []);

  // 임계값 넘으면 이웃 클립 위치까지 애니메이션(전환 종료 시 인덱스 확정).
  const handleVerticalSwipe = useCallback(
    (direction: "up" | "down") => {
      setDragging(false);
      const height = feedRef.current?.clientHeight ?? window.innerHeight;
      if (direction === "up") {
        if (!canNext) {
          setDragY(0);
          return;
        }
        pendingCommit.current = "next";
        setDragY(-height);
      } else {
        if (!canPrev) {
          setDragY(0);
          return;
        }
        pendingCommit.current = "prev";
        setDragY(height);
      }
    },
    [canNext, canPrev],
  );

  // 전환이 끝나면 인덱스를 바꾸고 무전환으로 위치를 0으로 되돌려 끊김을 없앤다.
  const handleFeedTransitionEnd = useCallback(() => {
    const commit = pendingCommit.current;
    if (!commit) return;
    pendingCommit.current = null;
    setNoTransition(true);
    if (commit === "next") moveToNext();
    else moveToPrev();
    setDragY(0);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setNoTransition(false)),
    );
  }, [moveToNext, moveToPrev]);

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
        <p className="text-sm text-neutral-400">
          영상이 업로드되면 알려드릴게요.
        </p>
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
    const isAllDone =
      !isError && allHighlights.length > 0 && unlabeledHighlights.length === 0;
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
              <p className="mt-2 text-sm text-green-400 font-medium">
                모든 영상 완료! 수고하셨어요 🥋
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">
              하이라이트를 불러오지 못했어요.
            </p>
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

  const progress =
    highlights.length > 0
      ? Math.round(
          ((highlights.length - unlabeledHighlights.length) /
            highlights.length) *
            100,
        )
      : 0;

  return (
    <div className="relative h-dvh overflow-hidden bg-black">
      {needsOnboarding && <OnboardingOverlay onDone={complete} />}

      <div className="absolute inset-x-0 top-[var(--safe-top)] z-30 h-0.5 bg-white/10">
        <div
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 세로 피드 — 드래그 중 위/아래 이웃 클립이 손가락을 따라 미리 보인다 */}
      <div
        ref={feedRef}
        className="absolute inset-0"
        style={{
          transform: `translateY(${dragY}px)`,
          transition:
            dragging || noTransition
              ? "none"
              : "transform 0.32s cubic-bezier(0.16,1,0.3,1)",
        }}
        onTransitionEnd={handleFeedTransitionEnd}
      >
        {prevHighlight && (
          <div className="absolute inset-0 -translate-y-full">
            <PreviewClip url={prevHighlight.clipUrl} />
          </div>
        )}

        <div className="absolute inset-0">
          <ShortsCard
            key={activeHighlight.id}
            highlight={activeHighlight}
            jobId={currentJob.id}
            index={highlightIndex}
            total={activeHighlights.length}
            onLabeled={moveToNext}
            onVerticalSwipe={handleVerticalSwipe}
            onVerticalDragMove={handleVerticalDragMove}
            onVerticalDragCancel={handleVerticalDragCancel}
            controlsLayer={controlsLayer}
          />
        </div>

        {nextHighlight && (
          <div className="absolute inset-0 translate-y-full">
            <PreviewClip url={nextHighlight.clipUrl} />
          </div>
        )}
      </div>

      {/* 카드 컨트롤 고정 레이어 — 피드 밖(#root)이라 세로 스크롤에도 안 움직인다 */}
      <div ref={setControlsLayer} />

      <VideoPreloader urls={preloadUrls} />
    </div>
  );
};
