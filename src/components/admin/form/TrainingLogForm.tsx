import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import ArticleForm from "./ArticleForm";
type TrainingLogFormProps = {
  data?: ArticleInfoType;
};
function TrainingLogForm({ data }: TrainingLogFormProps) {
  return <ArticleForm data={data} type={"training"} />;
}

export default TrainingLogForm;
