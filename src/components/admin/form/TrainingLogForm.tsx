import { ArticleInfoType } from "../../../types/ArticleInfoType";
import ArticleForm from "./ArticleForm";
type TrainingLogFormProps = {
  data?: ArticleInfoType;
};
function TrainingLogForm({ data }: TrainingLogFormProps) {
  return <ArticleForm apiUrl={""} data={data} type={"training"} />;
}

export default TrainingLogForm;
