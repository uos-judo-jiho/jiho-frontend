import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import ArticleForm from "./ArticleForm";

type NoticeFormProps = {
  data?: ArticleInfoType;
};
function NoticeForm({ data }: NoticeFormProps) {
  return <ArticleForm data={data} type={"notice"} />;
}

export default NoticeForm;
