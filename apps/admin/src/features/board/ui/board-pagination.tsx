import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import { BOARD_PAGE_SIZE } from "../api";

type BoardPaginationProps = {
  page: number;
  total: number;
  onChange: (page: number) => void;
};

/**
 * 목록 페이지 이동.
 *
 * 서버 목록이 한 번에 최대 100건까지만 내려오게 되면서(api#41) 전부 받아
 * 화면에서 자르던 방식을 더 쓸 수 없다. 페이지가 하나뿐이면 아무것도 그리지 않는다.
 */
export const BoardPagination = ({
  page,
  total,
  onChange,
}: BoardPaginationProps) => {
  const lastPage = Math.max(Math.ceil(total / BOARD_PAGE_SIZE) - 1, 0);

  if (lastPage === 0) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <NewArticleButton
        className="disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        이전
      </NewArticleButton>
      <span className="text-sm text-muted-foreground">
        {page + 1} / {lastPage + 1} (총 {total}건)
      </span>
      <NewArticleButton
        className="disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
      >
        다음
      </NewArticleButton>
    </div>
  );
};
