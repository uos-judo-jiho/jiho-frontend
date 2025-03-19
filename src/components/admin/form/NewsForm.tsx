import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import ArticleForm from "./ArticleForm";
type NewsFormProps = {
  data?: ArticleInfoType;
};
function NewsForm({ data }: NewsFormProps) {
  return <ArticleForm data={data} type={"news"} />;
}

export default NewsForm;
