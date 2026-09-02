import type { ReactNode } from "react";

import { Button } from "@/shared/ui/primitives/button";

type LoadMoreButtonProps = {
  onClick: () => void;
  loading?: boolean;
  children: ReactNode;
};

/**
 * 목록 아래의 "더 보기".
 *
 * 서버 목록이 페이지 단위로 바뀌면서(api#41) 한 화면에 전부 담기지 않는
 * 목록이 생겼다. 무한 스크롤 대신 버튼을 쓴다 — 푸터에 닿을 수 있어야 하고,
 * 스크롤 위치 복원도 그대로 동작한다.
 */
export const LoadMoreButton = ({
  onClick,
  loading = false,
  children,
}: LoadMoreButtonProps) => (
  <div className="flex justify-center">
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? "불러오는 중…" : children}
    </Button>
  </div>
);
