import {
  OnboardingOverlay,
  useOnboarding,
} from "@/components/onboarding-overlay";
import { ShortsCard } from "@/components/shorts-card";
import { VideoPreloader } from "@/components/video-preloader";
import { useUnlabeledHighlights } from "@/hooks/use-highlights";
import { useOrientationMode } from "@/hooks/use-orientation";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const ShortsPage = () => {
  const { needsOnboarding, complete } = useOnboarding();
  const { mode: orientationMode, toggle: toggleOrientation } =
    useOrientationMode();
  const [searchParams, setSearchParams] = useSearchParams();

  // 최초 URL의 highlightId를 한 번만 캡처(복원용) — ref는 렌더 간 안정적.
  const initialHighlightId = useRef(searchParams.get("highlightId"));
  const [urlInitialized, setUrlInitialized] = useState(
    !initialHighlightId.current,
  );

  // 잡 선택 없이, 로그인 사용자의 미라벨 하이라이트 플랫 피드(커서 페이지네이션).
  const {
    highlights: rawHighlights,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUnlabeledHighlights();

  const [highlightIndex, setHighlightIndex] = useState(0);
  // 라벨 저장에 성공한 하이라이트 id — 목록에서 빼지 않고 '완료'로만 표시(안정된 인덱스).
  const [labeledIds, setLabeledIds] = useState<Set<number>>(() => new Set());

  const markLabeled = useCallback((id: number) => {
    setLabeledIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // 라벨된 항목은 목록에 그대로 두되 '완료' 뱃지가 뜨도록 플래그만 덮어쓴다.
  const activeHighlights = useMemo(
    () =>
      rawHighlights.map((h) =>
        labeledIds.has(h.id) ? { ...h, isLabeledByCurrentUser: true } : h,
      ),
    [rawHighlights, labeledIds],
  );
  const activeHighlight = activeHighlights[highlightIndex];

  // URL의 highlightId로 위치 복원(로드된 페이지 범위 내에서 best-effort).
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

  // 현재 위치를 URL에 반영(replace로 히스토리 오염 방지).
  useEffect(() => {
    if (!urlInitialized) return;
    const highlight = activeHighlights[highlightIndex];
    if (!highlight) return;
    setSearchParams({ highlightId: String(highlight.id) }, { replace: true });
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- activeHighlights는 파생 배열; 인덱스가 동기화를 주도
  }, [urlInitialized, highlightIndex, activeHighlights, setSearchParams]);

  // 끝에서 3개 이내로 접근하면 다음 페이지를 미리 로드(커서 페이지네이션).
  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      highlightIndex >= activeHighlights.length - 3
    ) {
      fetchNextPage();
    }
  }, [
    highlightIndex,
    activeHighlights.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  // 다음 2개 클립 URL 프리로드.
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

  const moveToNext = useCallback(() => {
    setHighlightIndex((i) => (i + 1 < activeHighlights.length ? i + 1 : i));
  }, [activeHighlights.length]);

  // 위/아래 스와이프용 — 라벨 없이 이전 클립으로 이동.
  const moveToPrev = useCallback(() => {
    setHighlightIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  // ── 세로 페이저(릴스/쇼츠식) — 수직 드래그 시 위/아래 이웃 클립을 미리 보여준다 ──
  const prevHighlight =
    highlightIndex > 0 ? activeHighlights[highlightIndex - 1] : null;
  const nextHighlight =
    highlightIndex + 1 < activeHighlights.length
      ? activeHighlights[highlightIndex + 1]
      : null;
  // 로드된 클립 범위 내에서만 이동을 허용(경계에서 프리로드가 다음 페이지를 채운다).
  const canNext = highlightIndex + 1 < activeHighlights.length;
  const canPrev = highlightIndex > 0;

  // 로드된 모든 항목을 라벨했고 더 불러올 페이지도 없으면 '완료' 화면을 보여준다.
  const allLabeled =
    activeHighlights.length > 0 &&
    !hasNextPage &&
    !isFetchingNextPage &&
    activeHighlights.every((h) => h.isLabeledByCurrentUser);

  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const pendingCommit = useRef<"next" | "prev" | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  // 카드 컨트롤을 포탈할 고정 레이어(피드 transform 밖). 스크롤 시 UI 고정용.
  const [controlsLayer, setControlsLayer] = useState<HTMLDivElement | null>(
    null,
  );

  // 현재 클립 영상은 페이지가 소유(지속 요소) — 스왑 시 재사용해 깜빡임을 막는다.
  const currentVideoRef = useRef<HTMLVideoElement | null>(null);
  // 윈도우(이전/현재/다음) 영상 요소 — 현재만 재생, 이웃은 정지시키기 위해 참조.
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [hDragX, setHDragX] = useState(0); // 좌우 라벨 드래그 → 현재 슬롯 이동
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  // 데모 힌트가 만들어내는 가상 드래그 값(px). 실제 스와이프와 동일하게
  // 영상 이동 + SwipeDragOverlay 스탬프를 구동한다. 오른쪽(+)↔왼쪽(-) 번갈아.
  const [hintDragX, setHintDragX] = useState(0);
  const loopCount = useRef(0);
  const lastTime = useRef(0);
  // 현재 클립의 재생 시간(초). 하단 스크러버 표시·시크에 사용.
  const [videoTime, setVideoTime] = useState({ current: 0, duration: 0 });
  const scrubTrackRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);

  // 반복 재생 감지(loop 재시작) → 2회 이후 3번째 재생부터 라벨 스와이프 힌트.
  const handleTimeUpdate = useCallback(() => {
    const v = currentVideoRef.current;
    if (!v) return;
    if (v.currentTime + 0.1 < lastTime.current) {
      loopCount.current += 1;
      // 2회 반복 후(3번째 재생)부터 데모 힌트를 켠다.
      if (
        loopCount.current >= 2 &&
        activeHighlight &&
        !activeHighlight.isLabeledByCurrentUser
      ) {
        setShowSwipeHint(true);
      }
    }
    lastTime.current = v.currentTime;
    setVideoTime({
      current: v.currentTime,
      duration: Number.isFinite(v.duration) ? v.duration : 0,
    });
  }, [activeHighlight]);

  const handleInteract = useCallback(() => {
    setShowSwipeHint(false);
    loopCount.current = 0;
  }, []);

  // 스크러버 트랙 위 x좌표 → 해당 시각으로 시크.
  const seekToClientX = useCallback((clientX: number) => {
    const track = scrubTrackRef.current;
    const v = currentVideoRef.current;
    if (!track || !v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    const rect = track.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    v.currentTime = frac * v.duration;
    setVideoTime({ current: v.currentTime, duration: v.duration });
  }, []);

  // 현재 클립만 재생하고 이웃(이전/다음)은 정지시킨다(자동재생 방지).
  // 클립이 바뀌면 힌트/시간 상태도 초기화.
  useEffect(() => {
    const currentId = activeHighlight?.id;
    videoRefs.current.forEach((el, id) => {
      if (id === currentId) {
        el.currentTime = 0;
        void el.play().catch(() => { });
      } else {
        el.pause();
        el.currentTime = 0; // 이웃은 첫 프레임으로
      }
    });
    loopCount.current = 0;
    lastTime.current = 0;
    setShowSwipeHint(false);
    setVideoTime({ current: 0, duration: 0 });
  }, [activeHighlight?.id]);

  // 방치 데모 — 왼쪽(기술성공)↔오른쪽(기술시도)을 번갈아 끌고 잠깐 멈췄다 놓는
  // 가상 드래그를 만든다(실제 스와이프와 동일한 이동·스탬프).
  useEffect(() => {
    if (!showSwipeHint) return;
    const AMP = 82; // 임계값(60)보다 커서 스탬프가 꽉 찬 상태로 보인다
    const HALF = 2400; // 한 방향 주기(ms)
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeIn = (t: number) => t * t * t;
    const halfX = (p: number) => {
      if (p < 0.15 || p >= 0.9) return 0;
      if (p < 0.4) return AMP * easeOut((p - 0.15) / 0.25);
      if (p < 0.7) return AMP;
      return AMP * (1 - easeIn((p - 0.7) / 0.2));
    };
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const el = (now - start) % (HALF * 2);
      const p = (el % HALF) / HALF;
      setHintDragX(halfX(p) * (el < HALF ? 1 : -1)); // 오른쪽 먼저, 그다음 왼쪽
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setHintDragX(0);
    };
  }, [showSwipeHint]);

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

  // 기술x 등 버튼용 — 위로 슬라이드 애니메이션을 켜고, 저장과 최소 0.3초 지연을
  // Promise.all 로 함께 기다린 뒤 다음 클립으로 커밋한다(타이머 기반이라 안정적).
  const swipeUpNextWithSave = useCallback(
    (savePromise: Promise<unknown>) => {
      savePromise.catch(() => { }); // 미처리 거부 방지(아래 Promise.all에서 재처리)
      if (!canNext) return;
      const height = feedRef.current?.clientHeight ?? window.innerHeight;
      pendingCommit.current = null; // transitionEnd 커밋과 겹치지 않게
      setDragging(false);
      setDragY(-height);
      Promise.all([savePromise, new Promise((r) => setTimeout(r, 300))])
        .then(() => {
          setNoTransition(true);
          moveToNext();
          setDragY(0);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setNoTransition(false)),
          );
        })
        .catch(() => {
          setDragY(0); // 저장 실패 → 원위치(이동하지 않음)
        });
    },
    [canNext, moveToNext],
  );

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-sm text-neutral-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
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

  if (activeHighlights.length === 0) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 bg-black px-6 text-center text-white">
        <p className="text-lg font-semibold">라벨링할 하이라이트가 없어요</p>
        <p className="text-sm text-neutral-400">
          새 하이라이트가 준비되면 알려드릴게요.
        </p>
      </div>
    );
  }

  if (allLabeled || !activeHighlight) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <div className="text-5xl">🎉</div>
        <p className="text-xl font-bold">모든 하이라이트 완료!</p>
        <p className="mt-1 text-sm text-green-400 font-medium">
          수고하셨어요 🥋
        </p>
      </div>
    );
  }

  return (
    <div
      className={`shorts-root${orientationMode === "landscape" ? " shorts-root--landscape" : ""
        }`}
    >
      {needsOnboarding && <OnboardingOverlay onDone={complete} />}

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
        {/* 지속(keyed) 영상 슬롯 — 이전/현재/다음. 스왑 시 요소가 재사용돼
            리마운트/검은 프레임(깜빡임)이 없다. 현재만 소리·재생·힌트 대상. */}
        {(
          [
            { highlight: prevHighlight, offset: -1 },
            { highlight: activeHighlight, offset: 0 },
            { highlight: nextHighlight, offset: 1 },
          ] as const
        ).map(({ highlight, offset }) =>
          highlight ? (
            // 바깥: 세로 위치(offset)만 담당 — 전환 없이 즉시(윈도우 이동 시 세로 슬라이드 방지).
            <div
              key={highlight.id}
              className="absolute inset-0"
              style={{ transform: `translateY(${offset * 100}%)` }}
            >
              {/* 안쪽: 현재 슬롯만 좌우 라벨 드래그로 이동/회전(스냅백은 전환). */}
              <div
                className="h-full w-full"
                style={
                  offset === 0
                    ? {
                      transform: `translateX(${hDragX + hintDragX}px) rotate(${(hDragX + hintDragX) * 0.02}deg)`,
                      transition:
                        hDragX !== 0 || hintDragX !== 0
                          ? "none"
                          : "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
                    }
                    : undefined
                }
              >
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(highlight.id, el);
                    else videoRefs.current.delete(highlight.id);
                    if (offset === 0) currentVideoRef.current = el;
                  }}
                  src={highlight.clipUrl}
                  autoPlay={offset === 0}
                  loop
                  playsInline
                  preload="auto"
                  muted={offset !== 0}
                  onTimeUpdate={offset === 0 ? handleTimeUpdate : undefined}
                  onLoadedMetadata={offset === 0 ? handleTimeUpdate : undefined}
                  className="h-full w-full bg-black object-contain"
                />
              </div>
            </div>
          ) : null,
        )}

        <div className="absolute inset-0">
          {/* key 없이 유지 — 클립 변경 시 리마운트하지 않아 포탈 컨트롤이 깜빡이지 않는다. */}
          <ShortsCard
            highlight={activeHighlight}
            title={activeHighlight.originalFilename.replace(/\.[^.]+$/, "")}
            onLabeled={moveToNext}
            onLabelSaved={markLabeled}
            onSwipeUpNext={swipeUpNextWithSave}
            onVerticalSwipe={handleVerticalSwipe}
            onVerticalDragMove={handleVerticalDragMove}
            onVerticalDragCancel={handleVerticalDragCancel}
            controlsLayer={controlsLayer}
            videoRef={currentVideoRef}
            hintDragX={hintDragX}
            onHorizontalDragMove={setHDragX}
            onInteract={handleInteract}
            orientationMode={orientationMode}
            toggleOrientation={toggleOrientation}
          />
        </div>
      </div>

      {/* 카드 컨트롤 고정 레이어 — 피드 밖(#root)이라 세로 스크롤에도 안 움직인다 */}
      <div ref={setControlsLayer} />

      {/* 유튜브식 하단 진행바 — 시간 텍스트 없이 얇게, 드래그로 시크 */}
      <div
        ref={scrubTrackRef}
        className="fixed inset-x-0 bottom-[var(--safe-bottom)] z-30 cursor-pointer touch-none pt-3"
        onPointerDown={(e) => {
          scrubbing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          handleInteract();
          seekToClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (scrubbing.current) seekToClientX(e.clientX);
        }}
        onPointerUp={() => {
          scrubbing.current = false;
        }}
        onPointerCancel={() => {
          scrubbing.current = false;
        }}
      >
        <div className="h-[3px] w-full bg-white/25">
          <div
            className="h-full bg-indigo-400"
            style={{
              width: `${videoTime.duration > 0
                ? (videoTime.current / videoTime.duration) * 100
                : 0
                }%`,
            }}
          />
        </div>
      </div>

      <VideoPreloader urls={preloadUrls} />
    </div>
  );
};
