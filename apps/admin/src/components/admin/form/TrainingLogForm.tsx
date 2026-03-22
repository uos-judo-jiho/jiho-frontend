import { v2ApiModel } from "@packages/api/model";
import ArticleForm from "./ArticleForm";

type TrainingLogFormProps = {
  data?: v2ApiModel.GetApiV2TrainingId200Training;
};

function TrainingLogForm({ data }: TrainingLogFormProps) {
  return (
    <ArticleForm
      data={data ? { ...data, imgSrcs: data.images ?? [] } : undefined}
      type={"training"}
    />
  );
}

export default TrainingLogForm;
