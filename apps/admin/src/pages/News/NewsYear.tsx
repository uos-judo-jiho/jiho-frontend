import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import Loading from "@/components/common/Skeletons/Loading";
import ListContainer from "@/components/layouts/ListContainer";
import Row from "@/components/layouts/Row";
import { v2Api } from "@packages/api";
import { startTransition, Suspense } from "react";
import { Link, useParams } from "react-router-dom";

type NewsYearContentProps = {
  year: string;
};

const NewsYearContent = ({ year }: NewsYearContentProps) => {
  const { data: newsData, refetch } = v2Api.useGetApiV2NewsYearSuspense(
    Number(year),
    undefined,
    {
      query: {
        select: (response) => response.data,
      },
    },
  );

  const articles = newsData?.articles || [];

  return (
    <>
      <Row justifyContent="space-between">
        <Row gap={12} style={{ width: "auto" }}>
          <Link to={`/news/${year}/write`}>
            <NewArticleButton>새 글쓰기</NewArticleButton>
          </Link>
          <Link to={`/news/${year}/gallery`}>
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

      <ListContainer
        datas={articles}
        targetUrl={`/news/${year}/`}
        additionalTitle={true}
      />
    </>
  );
};

const NewsYear = () => {
  const { year } = useParams<{ year: string }>();

  return (
    <FormContainer title={`지호지 관리 (${year}년)`}>
      <Suspense fallback={<Loading loading />}>
        <NewsYearContent year={year ?? ""} />
      </Suspense>
    </FormContainer>
  );
};

export default NewsYear;
