import { useHighlightsFeed } from "@/entities/video";
import type { FeedHighlight } from "@/entities/video";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * 쇼츠 라벨링 피드의 위치 네비게이션을 담당하는 훅.
 * - 잡 선택 없이 미라벨 → (소진 시) 라벨 순으로 이어지는 플랫 피드를 소비(커서 페이지네이션).
 * - highlightIndex 하나로 현재 위치를 관리하고, URL(highlightId)과 동기화한다.
 * - 라벨 저장된 항목은 목록에서 빼지 않고 '완료' 플래그만 덮어써 인덱스가 밀리지 않게 한다.
 * - 끝에서 3개 이내로 접근하면 다음 페이지를 미리 로드한다.
 */
export const useClipNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 최초 URL의 highlightId를 한 번만 캡처(복원용) — ref는 렌더 간 안정적.
  const initialHighlightId = useRef(searchParams.get("highlightId"));
  const [urlInitialized, setUrlInitialized] = useState(
    !initialHighlightId.current,
  );

  const {
    highlights: rawHighlights,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useHighlightsFeed();

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
  const activeHighlights = useMemo<FeedHighlight[]>(
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

  return {
    isLoading,
    isError,
    activeHighlights,
    activeHighlight,
    prevHighlight,
    nextHighlight,
    canNext,
    canPrev,
    preloadUrls,
    moveToNext,
    moveToPrev,
    markLabeled,
  };
};
