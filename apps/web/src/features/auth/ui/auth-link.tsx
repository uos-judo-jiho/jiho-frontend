import { Link } from "@tanstack/react-router";

import { useLogout } from "../model/use-logout";
import { useMe } from "../model/use-me";

type AuthLinkProps = {
  className?: string;
  /**
   * 로그인 화면으로 떠날 때, 또는 로그아웃이 끝난 뒤 호출된다.
   * 드로어 안에서 쓸 때 드로어를 닫는 용도.
   */
  onNavigate?: () => void;
};

/**
 * 로그인 상태에 따라 "로그인" 링크와 "로그아웃" 버튼을 오가는 한 칸.
 *
 * 로그인 여부는 클라이언트에서만 알 수 있어서(`useMe`), 첫 렌더 — 서버가 그린
 * HTML 과 하이드레이션 직후 — 는 항상 "로그인" 이다. 응답이 오면 그때 바뀐다.
 *
 * 로그아웃 중에도 이 컴포넌트가 계속 떠 있어야 mutation 의 뒷정리가 돌기 때문에,
 * 드로어는 요청이 끝난 뒤에(`onFinish`) 닫는다.
 */
export const AuthLink = ({ className, onNavigate }: AuthLinkProps) => {
  const { isAuthenticated } = useMe();
  const { logout, isPending } = useLogout({ onFinish: onNavigate });

  if (!isAuthenticated) {
    return (
      <Link to="/login" onClick={onNavigate} className={className}>
        로그인
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => logout()}
      disabled={isPending}
      className={className}
    >
      {isPending ? "로그아웃 중…" : "로그아웃"}
    </button>
  );
};
