import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { v2ApiModel } from "@packages/api/model";
import { BookOpen } from "lucide-react";
import ImageUploader from "./ImageUploader/ImageUploader";
import MarkdownEditorField from "./MarkdownEditor/MarkdownEditorField";
import { FormContainer } from "./StyledComponent/FormContainer";
import { ArticleFormLayout } from "./shared/article-form-layout";
import { ArticlePreview } from "./shared/article-preview";
import {
  AuthorField,
  DateField,
  ParticipantField,
  TitleField,
} from "./shared/fields";
import { useArticleForm } from "./shared/use-article-form";

type TrainingLogFormProps = {
  data?: v2ApiModel.GetApiV2TrainingId200Training;
};

/**
 * 훈련일지 작성/수정 폼.
 *
 * 지호지·공지사항과 달리 태그 자리에 "참여 인원"이 들어가고, 부원 명부에서
 * 검색해 고를 수 있다.
 */
function TrainingLogForm({ data }: TrainingLogFormProps) {
  const article: ArticleInfoType | undefined = data
    ? { ...data, imgSrcs: data.images ?? [] }
    : undefined;

  const form = useArticleForm({ type: "training", data: article });

  return (
    <ArticleFormLayout
      form={form}
      title={article ? "훈련일지 수정" : "훈련일지 글쓰기"}
      icon={BookOpen}
      footer={
        <ArticlePreview
          values={form.values}
          titles={["작성자", "참여 인원", "훈련 날짜"]}
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
          <ParticipantField
            value={form.values.tags}
            onChange={form.setTags}
            disabled={form.readOnly}
          />
          <DateField
            label="훈련 날짜"
            value={form.values.dateTime}
            onChange={(dateTime) => form.setField("dateTime", dateTime)}
            disabled={form.readOnly}
          />
          <ImageUploader
            setValues={form.setImages}
            data={article?.imgSrcs.map(({ originSrc }) => originSrc)}
            imageLimit={10}
            disabled={form.readOnly}
          />
        </div>
      </FormContainer>

      <MarkdownEditorField
        value={form.values.description}
        onChange={(description) => form.setField("description", description)}
        onImageUpload={form.uploadInlineImage}
        type="training"
        disabled={form.readOnly}
      />
    </ArticleFormLayout>
  );
}

export default TrainingLogForm;
