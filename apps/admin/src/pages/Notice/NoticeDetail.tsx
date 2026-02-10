import NoticeForm from "@/components/admin/form/NoticeForm";
import Title from "@/components/layouts/Title";
import { Constants } from "@/shared/lib/constant";
import { v2Api } from "@packages/api";
import { useParams } from "react-router-dom";

const NoticeDetail = () => {
  const { id } = useParams();
  const { data: notices = [] } = v2Api.useGetApiV2Notices(undefined, {
    query: {
      select: (response) => response.data.notices ?? [],
    },
  });

  const targetArticle = notices.find((item) => item.id.toString() === id);

  return (
    <>
      <Title title={"공지사항 작성"} color={Constants.BLACK_COLOR} />
      <NoticeForm data={targetArticle} />
    </>
  );
};

export default NoticeDetail;
