import React, { useEffect, useState } from "react";
import demoNotice from "../../../assets/jsons/tmpNotice.json";
import { useParams } from "react-router-dom";
import { ArticleInfoType } from "../../../types/ArticleInfoType";
import Title from "../../../layouts/Title";
import { Constants } from "../../../constant/constant";
import NoticeForm from "../../../components/admin/form/NoticeForm";

function AdminNoticeDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleInfoType>();
  useEffect(() => {
    const targetArticle = demoNotice?.find((item) => item.id.toString() === id);
    setArticle(targetArticle);
  }, []);
  return (
    <>
      <Title title={"공지사항 수항"} color={Constants.BLACK_COLOR} />
      <NoticeForm data={article} />
    </>
  );
}

export default AdminNoticeDetail;
