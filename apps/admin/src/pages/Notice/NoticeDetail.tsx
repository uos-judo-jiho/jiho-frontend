import NoticeForm from "@/components/admin/form/NoticeForm";
import { ReactionStatus } from "@/features/reaction";
import { v2Api } from "@packages/api";
import { useParams } from "@tanstack/react-router";

export const NoticeDetail = () => {
  const { id } = useParams({ strict: false });
  const { data } = v2Api.useListNotices(undefined, {
    query: {
      select: (response) =>
        response.data.notices.find((item) => item.id.toString() === id),
    },
  });

  if (!data) {
    throw new Error("공지사항을 찾을 수 없습니다.");
  }

  return (
    <div className="flex flex-col gap-4">
      <ReactionStatus boardId={data.id} />
      {/* 읽기 응답이 곧 폼이 쓰는 모양이다 (api#40) */}
      <NoticeForm data={data} />
    </div>
  );
};
