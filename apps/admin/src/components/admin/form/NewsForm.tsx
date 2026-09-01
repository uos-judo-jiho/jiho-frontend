import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { Newspaper } from "lucide-react";
import { FormContainer } from "./StyledComponent/FormContainer";
import { ArticleFormLayout } from "./shared/article-form-layout";
import { ArticlePreview } from "./shared/article-preview";
import {
  AuthorField,
  DateField,
  DescriptionField,
  ImageField,
  TagField,
  TitleField,
} from "./shared/fields";
import { useArticleForm } from "./shared/use-article-form";

type NewsFormProps = {
  data?: ArticleInfoType;
};

/** 지호지 기사 작성/수정 폼. */
function NewsForm({ data }: NewsFormProps) {
  const form = useArticleForm({ type: "news", data });

  return (
    <ArticleFormLayout
      form={form}
      title={data ? "지호지 수정" : "지호지 글쓰기"}
      icon={Newspaper}
      footer={<ArticlePreview titles={["작성자", "카테고리", "작성일"]} />}
    >
      <FormContainer>
        <div>
          <AuthorField disabled={form.readOnly} fixed={form.isAuthorFixed} />
          <TitleField disabled={form.readOnly} />
          <TagField disabled={form.readOnly} />
          <DateField label="작성일" disabled={form.readOnly} />
          <ImageField disabled={form.readOnly} />
        </div>
      </FormContainer>

      <DescriptionField type="news" disabled={form.readOnly} />
    </ArticleFormLayout>
  );
}

export default NewsForm;
