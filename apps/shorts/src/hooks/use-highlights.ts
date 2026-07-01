import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import {
  createHighlightLabel,
  getLabeledHighlights,
  getUnlabeledHighlights,
  type CreateLabelBody,
  type FeedHighlight,
} from "@/api/video";

const FEED_QUERY_BASE = {
  initialPageParam: undefined as number | undefined,
  getNextPageParam: (lastPage: { nextCursor: number | null }) =>
    lastPage.nextCursor ?? undefined,
  // staleTime 무한 + focus 리페치 off — 세션 중 목록이 흔들리지 않게(인덱스 밀림 방지).
  staleTime: Number.POSITIVE_INFINITY,
  refetchOnWindowFocus: false,
} as const;

/**
 * 라벨링 피드 — 잡 선택 없이 미라벨 하이라이트를 먼저 노출하고,
 * 미라벨을 모두 소진하면 이미 라벨한 하이라이트를 이어붙여 계속 보여준다.
 * 두 피드 모두 커서 페이지네이션. id 기준으로 중복 제거해 이어붙인다.
 */
export const useHighlightsFeed = (): {
  highlights: FeedHighlight[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
} => {
  const unlabeled = useInfiniteQuery({
    queryKey: ["unlabeledHighlights"],
    queryFn: ({ pageParam }) => getUnlabeledHighlights(pageParam),
    ...FEED_QUERY_BASE,
  });

  // 미라벨을 다 불러온 뒤에만 라벨 피드 로드를 시작한다.
  const labeledEnabled = !unlabeled.isLoading && !unlabeled.hasNextPage;
  const labeled = useInfiniteQuery({
    queryKey: ["labeledHighlights"],
    queryFn: ({ pageParam }) => getLabeledHighlights(pageParam),
    enabled: labeledEnabled,
    ...FEED_QUERY_BASE,
  });

  const highlights = useMemo(() => {
    const merged = [
      ...(unlabeled.data?.pages.flatMap((p) => p.items) ?? []),
      ...(labeled.data?.pages.flatMap((p) => p.items) ?? []),
    ];
    const seen = new Set<number>();
    return merged.filter((h) => {
      if (seen.has(h.id)) return false;
      seen.add(h.id);
      return true;
    });
  }, [unlabeled.data, labeled.data]);

  // 미라벨 소진 직후 라벨 첫 페이지 로딩 중이면 아직 더 있을 수 있음으로 취급.
  const labeledPending = labeledEnabled && labeled.isLoading;
  const hasNextPage =
    unlabeled.hasNextPage || labeled.hasNextPage || labeledPending;

  const fetchNextPage = useCallback(() => {
    if (unlabeled.hasNextPage) unlabeled.fetchNextPage();
    else if (labeled.hasNextPage) labeled.fetchNextPage();
    // labeledPending: enabled 전환으로 자동 로드되므로 별도 트리거 불필요.
  }, [unlabeled, labeled]);

  return {
    highlights,
    // 보여줄 게 하나도 없을 때만 로딩 스피너(브라우징 중 라벨 로드는 스피너 X).
    isLoading:
      highlights.length === 0 && (unlabeled.isLoading || labeledPending),
    isError: unlabeled.isError,
    hasNextPage,
    isFetchingNextPage:
      unlabeled.isFetchingNextPage || labeled.isFetchingNextPage,
    fetchNextPage,
  };
};

/**
 * 하이라이트 라벨 저장. 미라벨 피드를 즉시 invalidate 하지 않는다 —
 * 라벨된 항목은 목록에 그대로 두고(안정된 인덱스) '완료' 뱃지로만 표시해
 * 스와이프/슬라이드가 튀지 않게 한다. 다음 로드 때 서버가 미라벨만 다시 내려준다.
 */
export const useCreateLabel = () =>
  useMutation({
    mutationFn: ({
      highlightId,
      data,
    }: {
      highlightId: number;
      data: CreateLabelBody;
    }) => createHighlightLabel(highlightId, data),
  });
