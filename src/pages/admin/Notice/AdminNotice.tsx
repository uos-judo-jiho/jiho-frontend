import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import FormContainer from "../../../components/admin/form/FormContainer";
import { NewArticleButton } from "../../../components/admin/form/StyledComponent/FormContainer";
import ListContainer from "@/components/layouts/ListContainer";
import { useNotices } from "../../../recoills/notices";
import Row from "@/components/layouts/Row";

const AdminNotice = () => {
  const { notices, refreshNotice } = useNotices();
  useEffect(() => {
    refreshNotice();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormContainer title="공지사항 관리">
      <Row justifyContent="space-between">
        <Link to="/admin/notice/write">
          <NewArticleButton>새 글쓰기</NewArticleButton>
        </Link>
        <NewArticleButton onClick={() => refreshNotice()}>
          새로고침
        </NewArticleButton>
      </Row>
      <ListContainer datas={notices} targetUrl={"/admin/notice/"} />
    </FormContainer>
  );
};

export default AdminNotice;
