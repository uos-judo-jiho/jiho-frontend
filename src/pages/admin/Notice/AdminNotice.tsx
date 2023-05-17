import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import demoNotice from "../../../assets/jsons/tmpNotice.json";
import FormContainer from "../../../components/admin/form/FormContainer";
import { NewArticleButton } from "../../../components/admin/form/StyledComponent/FormContainer";
import ListContainer from "../../../layouts/ListContainer";
import { ArticleInfoType } from "../../../types/ArticleInfoType";

function AdminNotice() {
  const [articleArray, setArticleArray] = useState<ArticleInfoType[]>();

  useEffect(() => {
    setArticleArray(demoNotice);
  }, []);

  //   const { loading, error, response } = useFetchData(getTrainings, "2022");

  //   useEffect(() => {
  //     if (!loading && !error && response) {
  //       const reversedDatas = response.trainingLogs.slice(0).reverse();
  //       setArticleArray(reversedDatas);
  //     }
  //   }, [loading, error, response]);

  if (!articleArray) return <></>;

  function handleNewArticle(event: React.MouseEvent<HTMLButtonElement>) {}

  return (
    <FormContainer title="공지사항 관리">
      <Link to="/admin/notice/write">
        <NewArticleButton onClick={handleNewArticle}>
          새 글쓰기
        </NewArticleButton>
      </Link>
      <ListContainer datas={articleArray} targetUrl={"/admin/notice/"} />
    </FormContainer>
  );
}

export default AdminNotice;
