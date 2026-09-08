import NewsForm from "@/components/admin/form/NewsForm";
import { useBoardDetail } from "@/features/board";
import { ReactionStatus } from "@/features/reaction";
import { useParams } from "@tanstack/react-router";

const NewsDetail = () => {
  const { id } = useParams({ strict: false });

  // 예전에는 그 해 기사를 전부 받아 그중 하나를 찾았다. 단건 조회가 생기면서
  // 목록을 통째로 내려받을 이유가 없어졌다 (api#41).
  const { data: article } = useBoardDetail(Number(id));

  return (
    <div className="flex flex-col gap-4">
      <ReactionStatus boardId={article.id} />
      <NewsForm data={article} />
    </div>
  );
};

export default NewsDetail;
