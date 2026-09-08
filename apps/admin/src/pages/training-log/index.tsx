import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import Loading from "@/components/common/Skeletons/Loading";
import ListContainer from "@/components/layouts/ListContainer";
import Row from "@/components/layouts/Row";
import {
  BOARD_PAGE_SIZE,
  BoardPagination,
  useBoardPage,
} from "@/features/board";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export const TrainingLogPage = () => {
  const [page, setPage] = useState(0);

  // 통합 목록 엔드포인트가 최신순으로 페이지 단위로 준다 (api#41) —
  // 예전처럼 전부 받아 화면에서 정렬할 필요가 없다.
  const {
    data,
    refetch: refreshTraining,
    isLoading,
    isRefetching,
  } = useBoardPage({ type: "training", page });

  const isDataLoading = isLoading || isRefetching;

  return (
    <FormContainer title="훈련일지 관리">
      <p className="text-sm text-muted-foreground mb-2">
        새로운 훈련 일지를 자유롭게 작성해주세요.
      </p>
      <Row justifyContent="space-between">
        <Link to="/training/write">
          <NewArticleButton>새 글쓰기</NewArticleButton>
        </Link>
        <NewArticleButton onClick={() => refreshTraining()}>
          새로고침
        </NewArticleButton>
      </Row>
      {isDataLoading ? (
        <Loading loading={isDataLoading} />
      ) : (
        <>
          <ListContainer
            datas={data?.items ?? []}
            targetUrl={"/training/"}
            additionalTitle={true}
            startIndex={page * BOARD_PAGE_SIZE}
          />
          <BoardPagination
            page={page}
            total={data?.total ?? 0}
            onChange={setPage}
          />
        </>
      )}
    </FormContainer>
  );
};
