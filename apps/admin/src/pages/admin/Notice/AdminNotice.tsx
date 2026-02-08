import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import ListContainer from "@/components/layouts/ListContainer";
import Row from "@/components/layouts/Row";
import { v1Api } from "@packages/api";
import { Link } from "react-router-dom";

const AdminNotice = () => {
  const { data: notices = [], refetch } = v1Api.useGetApiV1Notices(undefined, {
    query: {
      select: (response) => response.data.notices ?? [],
    },
  });

  return (
    <FormContainer title="공지사항 관리">
      <Row justifyContent="space-between">
        <Link to="/admin/notice/write">
          <NewArticleButton>새 글쓰기</NewArticleButton>
        </Link>
        <NewArticleButton onClick={() => refetch()}>새로고침</NewArticleButton>
      </Row>
      <ListContainer datas={notices} targetUrl={"/admin/notice/"} />
    </FormContainer>
  );
};

export default AdminNotice;
