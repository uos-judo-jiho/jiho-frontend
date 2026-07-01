import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  createHighlightLabel,
  getUnlabeledHighlights,
  type CreateLabelBody,
  type FeedHighlight,
} from "@/api/video";

/**
 * 로그인 사용자의 미라벨 하이라이트 플랫 피드(커서 페이지네이션).
 * 최초 로드시 잡 선택 없이 아직 라벨링하지 않은 하이라이트만 노출한다.
 * staleTime을 무한으로 두어 세션 중 목록이 흔들리지 않게(인덱스 밀림 방지) 유지한다.
 */
export const useUnlabeledHighlights = (): {
  highlights: FeedHighlight[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
} => {
  const query = useInfiniteQuery({
    queryKey: ["unlabeledHighlights"],
    queryFn: ({ pageParam }) => getUnlabeledHighlights(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  });

  const highlights = useMemo(
    () => query.data?.pages.flatMap((p) => p.items) ?? [],
    [query.data],
  );

  return {
    highlights,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
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
