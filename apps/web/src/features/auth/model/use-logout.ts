import { v2Admin } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { meQueryKey } from "./use-me";

type UseLogoutOptions = {
  /** 로그아웃 요청이 끝난 뒤 (성공·실패 모두) 호출된다 — 드로어 닫기 등 */
  onFinish?: () => void;
};

/**
 * 로그아웃.
 *
 * 인증 쿠키는 HttpOnly 라 서버가 지워 줘야 하고, 응답의 Set-Cookie 는 `/api`
 * 프록시가 그대로 흘려보낸다. 로그인처럼 전체 새로고침을 하지는 않고, 로그인
 * 상태에 따라 달라지는 캐시만 버린 뒤 홈으로 이동한다.
 */
export const useLogout = ({ onFinish }: UseLogoutOptions = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = v2Admin.useAdminLogout({
    mutation: {
      // 요청이 실패하더라도(세션이 이미 만료된 경우 등) 클라이언트에 남은
      // 로그인 흔적은 지운다 — 그대로 두면 화면만 로그인 상태로 남는다
      onSettled: () => {
        queryClient.removeQueries({ queryKey: meQueryKey });
        // 좋아요는 사용자별 응답(`reacted`)이라 다시 받아야 한다
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes("reactions"),
        });

        onFinish?.();
        navigate({ to: "/" });
      },
    },
    axios: { withCredentials: true },
  });

  return { logout: mutate, isPending };
};
