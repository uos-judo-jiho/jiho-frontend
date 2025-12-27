import NoticeForm from "@/components/admin/form/NoticeForm";
import Title from "@/components/layouts/Title";
import { useNoticesQuery } from "@/features/api/notices/query";
import { Constants } from "@/shared/lib/constant";
import { useParams } from "react-router-dom";

const AdminNoticeDetail = () => {
  const { id } = useParams();
  const { data: notices = [] } = useNoticesQuery();

  const targetArticle = notices.find((item) => item.id.toString() === id);

  return (
    <>
      <Title title={"공지사항 작성"} color={Constants.BLACK_COLOR} />
      <NoticeForm data={targetArticle} />
    </>
  );
};

export default AdminNoticeDetail;
