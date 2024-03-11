import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import FormContainer from "../../../components/admin/form/FormContainer";
import { NewArticleButton } from "../../../components/admin/form/StyledComponent/FormContainer";
import ListContainer from "../../../layouts/ListContainer";
import { useNotices } from "../../../recoills/notices";

function AdminNotice() {
  const { notices, fetch } = useNotices();
  useEffect(() => {
    fetch();
  }, []);

  function handleNewArticle(event: React.MouseEvent<HTMLButtonElement>) {}

  return (
    <FormContainer title="공지사항 관리">
      <Link to="/admin/notice/write">
        <NewArticleButton onClick={handleNewArticle}>
          새 글쓰기
        </NewArticleButton>
      </Link>
      <ListContainer datas={notices} targetUrl={"/admin/notice/"} />
    </FormContainer>
  );
}

export default AdminNotice;
