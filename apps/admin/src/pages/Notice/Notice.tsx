import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import ListContainer from "@/components/layouts/ListContainer";
import Row from "@/components/layouts/Row";
import {
  BOARD_PAGE_SIZE,
  BoardPagination,
  useBoardPage,
} from "@/features/board";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

const Notice = () => {
  const [page, setPage] = useState(0);
  const { data, refetch } = useBoardPage({ type: "notice", page });

  return (
    <FormContainer title="공지사항 관리">
      <Row justifyContent="space-between">
        <Link to="/notice/write">
          <NewArticleButton>새 글쓰기</NewArticleButton>
        </Link>
        <NewArticleButton onClick={() => refetch()}>새로고침</NewArticleButton>
      </Row>
      <ListContainer
        datas={data?.items ?? []}
        targetUrl={"/notice/"}
        startIndex={page * BOARD_PAGE_SIZE}
      />
      <BoardPagination
        page={page}
        total={data?.total ?? 0}
        onChange={setPage}
      />
    </FormContainer>
  );
};

export default Notice;
