import TrainingLogForm from "@/components/admin/form/TrainingLogForm";
import { useBoardDetail } from "@/features/board";
import { ReactionStatus } from "@/features/reaction";
import { assert } from "es-toolkit";
import { useParams } from "@tanstack/react-router";

export const TrainingLogDetail = () => {
  const { id } = useParams({ strict: false });

  assert(id !== undefined, "훈련일지 ID가 없습니다.");

  // 종류를 가리지 않는 단건 엔드포인트 하나로 모였다 (api#41)
  const { data: trainingLog } = useBoardDetail(Number(id));

  return (
    <div className="flex flex-col gap-4">
      <ReactionStatus boardId={Number(id)} />
      <TrainingLogForm data={trainingLog} />
    </div>
  );
};
