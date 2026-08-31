import { v2Api } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

import { openConfirmDialog } from "@/shared/ui/confirm-dialog";

import type { ReactionSummary, ReactionType } from "./types";

const EMPTY_SUMMARY: ReactionSummary = { count: 0, reacted: false };

/**
 * 게시글 반응(좋아요) 상태와 토글 동작.
 *
 * ## 왜 loader 에서 prefetch 하지 않는가
 *
 * 다른 쿼리는 전부 route loader 에서 미리 받아 SSR 에 실어 보내지만, 반응만은
 * 클라이언트에서만 조회한다. SSR 의 axios 는 절대 URL 로 백엔드를 직접 호출하고
 * 브라우저 쿠키를 실어 보내지 않기 때문에(`router.tsx` 의 인터셉터 참고), 서버에서
 * 받아온 응답의 `reacted` 는 로그인한 사용자에게도 항상 false 다. 그 값을 dehydrate
 * 하면 이미 누른 좋아요가 빈 하트로 굳어버린다 — 전역 staleTime 이 24시간이고
 * `refetchOnMount: false` 라 스스로 회복되지도 않는다.
 *
 * 그래서 이 쿼리만 클라이언트 전용으로 두고 staleTime 을 0 으로 되돌린다. SSR 과
 * 하이드레이션 직후의 첫 렌더는 둘 다 데이터가 없는 상태이므로 마크업이 일치하고,
 * 응답이 도착한 뒤에 실제 수치로 바뀐다.
 */
export const useBoardReaction = (
  boardId: number,
  type: ReactionType = "like",
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentHref = useRouterState({
    select: (state) => state.location.href,
  });

  // 매 렌더마다 새 배열이 나오므로 아래 콜백들의 의존성이 흔들리지 않게 고정한다
  const queryKey = useMemo(
    () => v2Api.getGetApiV2BoardsBoardIdReactionsQueryKey(boardId),
    [boardId],
  );

  const { data, isPending } = v2Api.useGetApiV2BoardsBoardIdReactions(boardId, {
    query: {
      // 사용자마다 다르고 자주 바뀌는 값이라 전역 캐시 정책(24시간)에서 빼낸다
      staleTime: 0,
      refetchOnMount: true,
      select: (response) => {
        const found = response.data.reactions.find(
          (reaction) => reaction.type === type,
        );

        return found
          ? { count: found.count, reacted: found.reacted }
          : EMPTY_SUMMARY;
      },
    },
  });

  const summary = data ?? EMPTY_SUMMARY;

  /**
   * 등록/취소 응답은 갱신된 요약을 그대로 돌려주므로 (API PR #35), 캐시에 그 값을
   * 그대로 넣으면 재조회 없이 낙관적 갱신이 확정된다.
   */
  const handleSuccess = useCallback(
    (response: unknown) => queryClient.setQueryData(queryKey, response),
    [queryClient, queryKey],
  );

  /**
   * 로그인이 필요한 요청에서 401 이 오면 안내 모달을 띄운다.
   * 웹에는 별도의 인증 상태 저장소가 없어서 누르기 전에 로그인 여부를 알 수 없고,
   * 그래서 401 은 "잘못된 요청"이 아니라 "비회원이 눌렀다"는 신호다. 곧바로
   * 로그인 화면으로 튕기면 읽던 글에서 예고 없이 밀려나므로, 먼저 이유를 알리고
   * 사용자가 고르게 한다. 닫으면 보던 글에 그대로 남는다.
   */
  const handleError = useCallback(
    (error: unknown) => {
      // 낙관적으로 바꿔 둔 하트를 서버 값으로 되돌린다
      queryClient.invalidateQueries({ queryKey });

      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status !== 401) return;

      void openConfirmDialog({
        title: "로그인이 필요해요",
        description: "로그인 후 게시글에 좋아요를 눌러주세요.",
        confirmLabel: "로그인하기",
        cancelLabel: "닫기",
      }).then((confirmed) => {
        if (!confirmed) return;

        navigate({
          to: "/login",
          // 로그인 뒤 누르던 글로 돌아온다.
          // 라우터가 검색 파라미터를 알아서 인코딩하므로 여기서 또 감싸지 않는다.
          search: { redirectTo: currentHref },
        });
      });
    },
    [navigate, currentHref, queryClient, queryKey],
  );

  const mutationOptions = {
    mutation: {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  };

  const add = v2Api.usePutApiV2BoardsBoardIdReactionsType(mutationOptions);
  const remove =
    v2Api.useDeleteApiV2BoardsBoardIdReactionsType(mutationOptions);

  const toggle = useCallback(() => {
    if (add.isPending || remove.isPending) return;

    // 낙관적 갱신: 서버 응답을 기다리지 않고 하트를 먼저 채운다.
    // 성공하면 응답의 요약으로, 실패하면 재조회로 덮어쓰므로 최종 값은 서버가 정한다.
    queryClient.setQueryData(queryKey, (previous: unknown) => {
      if (!previous) return previous;

      const response = previous as {
        data: {
          totalCount: number;
          reactions: { type: string; count: number; reacted: boolean }[];
        };
      };

      const delta = summary.reacted ? -1 : 1;

      return {
        ...response,
        data: {
          ...response.data,
          totalCount: Math.max(0, response.data.totalCount + delta),
          reactions: response.data.reactions.map((reaction) =>
            reaction.type === type
              ? {
                  ...reaction,
                  count: Math.max(0, reaction.count + delta),
                  reacted: !summary.reacted,
                }
              : reaction,
          ),
        },
      };
    });

    const variables = { boardId, type };

    if (summary.reacted) {
      remove.mutate(variables);
    } else {
      add.mutate(variables);
    }
  }, [add, remove, boardId, type, summary.reacted, queryClient, queryKey]);

  return {
    count: summary.count,
    reacted: summary.reacted,
    /** 첫 조회가 끝나기 전 (SSR·하이드레이션 직후) */
    isLoading: isPending,
    isMutating: add.isPending || remove.isPending,
    toggle,
  };
};
