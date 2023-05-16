import { ArticleInfoType } from "../../../types/ArticleInfoType";
import ArticleForm from "./ArticleForm";

type NoticeFormProps = {
  data?: ArticleInfoType;
};
function NoticeForm({ data }: NoticeFormProps) {
  return <ArticleForm apiUrl={""} data={data} />;
}

export default NoticeForm;
