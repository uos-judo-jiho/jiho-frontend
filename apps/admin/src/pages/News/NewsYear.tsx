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
import { startTransition, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";

type NewsYearContentProps = {
  year: string;
};

const NewsYearContent = ({ year }: NewsYearContentProps) => {
  const [page, setPage] = useState(0);

  // 연도별 지호지도 통합 목록의 `year` 필터로 받는다 (api#41)
  const { data, refetch, isLoading } = useBoardPage({
    type: "news",
    year: Number(year),
    page,
  });

  return (
    <>
      <Row justifyContent="space-between">
        <Row gap={12} style={{ width: "auto" }}>
          <Link to="/news/$year/write" params={{ year: String(year) }}>
            <NewArticleButton>새 글쓰기</NewArticleButton>
          </Link>
          <Link to="/news/$year/gallery" params={{ year: String(year) }}>
            <NewArticleButton>{year}년 갤러리 보기</NewArticleButton>
          </Link>
        </Row>
        <NewArticleButton
          onClick={() => {
            startTransition(() => {
              void refetch();
            });
          }}
        >
          새로고침
        </NewArticleButton>
      </Row>

      {isLoading ? (
        <Loading loading />
      ) : (
        <>
          <ListContainer
            datas={data?.items ?? []}
            targetUrl={`/news/${year}/`}
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
    </>
  );
};

const NewsYear = () => {
  const { year } = useParams({ strict: false });

  return (
    <FormContainer title={`지호지 관리 (${year}년)`}>
      <NewsYearContent year={year ?? ""} />
    </FormContainer>
  );
};

export default NewsYear;
