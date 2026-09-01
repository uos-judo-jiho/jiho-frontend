import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { Newspaper } from "lucide-react";
import ImageUploader from "./ImageUploader/ImageUploader";
import MarkdownEditorField from "./MarkdownEditor/MarkdownEditorField";
import { FormContainer } from "./StyledComponent/FormContainer";
import { ArticleFormLayout } from "./shared/article-form-layout";
import { ArticlePreview } from "./shared/article-preview";
import { AuthorField, DateField, TagField, TitleField } from "./shared/fields";
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
      footer={
        <ArticlePreview
          values={form.values}
          titles={["작성자", "카테고리", "작성일"]}
        />
      }
    >
      <FormContainer>
        <div>
          <AuthorField
            value={form.values.author}
            onChange={form.setAuthor}
            disabled={form.readOnly}
            fixed={form.isAuthorFixed}
          />
          <TitleField
            value={form.values.title}
            onChange={(title) => form.setField("title", title)}
            disabled={form.readOnly}
          />
          <TagField
            value={form.values.tags}
            onChange={form.setTags}
            disabled={form.readOnly}
          />
          <DateField
            label="작성일"
            value={form.values.dateTime}
            onChange={(dateTime) => form.setField("dateTime", dateTime)}
            disabled={form.readOnly}
          />
          <ImageUploader
            setValues={form.setImages}
            data={data?.imgSrcs.map(({ originSrc }) => originSrc)}
            imageLimit={10}
            disabled={form.readOnly}
          />
        </div>
      </FormContainer>

      <MarkdownEditorField
        value={form.values.description}
        onChange={(description) => form.setField("description", description)}
        onImageUpload={form.uploadInlineImage}
        type="news"
        disabled={form.readOnly}
      />
    </ArticleFormLayout>
  );
}

export default NewsForm;
