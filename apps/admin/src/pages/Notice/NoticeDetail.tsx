import NoticeForm from "@/components/admin/form/NoticeForm";
import { v2Api } from "@packages/api";
import { useParams } from "@tanstack/react-router";

export const NoticeDetail = () => {
  const { id } = useParams({ strict: false });
  const { data } = v2Api.useGetApiV2Notices(undefined, {
    query: {
      select: (response) => response.data.notices.find((item) => item.id.toString() === id),
    },
  });

  if (!data) {
    throw new Error("공지사항을 찾을 수 없습니다.");
  }

  const { images, ...rest } = data;

  const noticeData = { ...rest, imgSrcs: images.map((v) => v) ?? [] };

  return <NoticeForm data={noticeData} />;
};
