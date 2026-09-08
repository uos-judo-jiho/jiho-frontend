import NoticeForm from "@/components/admin/form/NoticeForm";
import { useBoardDetail } from "@/features/board";
import { ReactionStatus } from "@/features/reaction";
import { useParams } from "@tanstack/react-router";

export const NoticeDetail = () => {
  const { id } = useParams({ strict: false });

  // 목록에서 찾아 쓰던 것을 단건 조회로 바꿨다 (api#41)
  const { data } = useBoardDetail(Number(id));

  return (
    <div className="flex flex-col gap-4">
      <ReactionStatus boardId={data.id} />
      {/* 읽기 응답이 곧 폼이 쓰는 모양이다 (api#40) */}
      <NoticeForm data={data} />
    </div>
  );
};
