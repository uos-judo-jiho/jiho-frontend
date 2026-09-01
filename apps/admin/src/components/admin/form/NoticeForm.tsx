import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { Bell } from "lucide-react";
import ImageUploader from "./ImageUploader/ImageUploader";
import MarkdownEditorField from "./MarkdownEditor/MarkdownEditorField";
import { FormContainer } from "./StyledComponent/FormContainer";
import { ArticleFormLayout } from "./shared/article-form-layout";
import { ArticlePreview } from "./shared/article-preview";
import { AuthorField, DateField, TagField, TitleField } from "./shared/fields";
import { useArticleForm } from "./shared/use-article-form";

type NoticeFormProps = {
  data?: ArticleInfoType;
};

/** 공지사항 작성/수정 폼. 운영 부원 이상만 저장할 수 있다. */
function NoticeForm({ data }: NoticeFormProps) {
  const form = useArticleForm({ type: "notice", data });

  return (
    <ArticleFormLayout
      form={form}
      title={data ? "공지사항 수정" : "공지사항 글쓰기"}
      icon={Bell}
      footer={
        <ArticlePreview
          values={form.values}
          titles={["작성자", "태그", "작성일"]}
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
        type="notice"
        disabled={form.readOnly}
      />
    </ArticleFormLayout>
  );
}

export default NoticeForm;
