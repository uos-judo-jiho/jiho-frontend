import { useEffect } from "react";
import { useParams } from "react-router-dom";
import NoticeForm from "../../../components/admin/form/NoticeForm";
import { Constants } from "@/lib/constant";
import Title from "@/components/layouts/Title";
import { useNotices } from "../../../recoills/notices";

const AdminNoticeDetail = () => {
  const { id } = useParams();
  const { notices, refreshNotice } = useNotices();

  useEffect(() => {
    refreshNotice();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const targetArticle = notices.find((item) => item.id.toString() === id);

  return (
    <>
      <Title title={"공지사항 작성"} color={Constants.BLACK_COLOR} />
      <NoticeForm data={targetArticle} />
    </>
  );
};

export default AdminNoticeDetail;
