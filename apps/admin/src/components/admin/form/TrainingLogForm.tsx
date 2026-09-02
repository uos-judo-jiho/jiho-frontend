import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { v2ApiModel } from "@packages/api/model";
import { BookOpen } from "lucide-react";
import { FormContainer } from "./StyledComponent/FormContainer";
import { ArticleFormLayout } from "./shared/article-form-layout";
import { ArticlePreview } from "./shared/article-preview";
import {
  AuthorField,
  DateField,
  DescriptionField,
  ImageField,
  ParticipantField,
  TitleField,
} from "./shared/fields";
import { useArticleForm } from "./shared/use-article-form";

type TrainingLogFormProps = {
  data?: v2ApiModel.BoardDetail;
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
      footer={<ArticlePreview titles={["작성자", "참여 인원", "훈련 날짜"]} />}
    >
      <FormContainer>
        <div>
          <AuthorField disabled={form.readOnly} fixed={form.isAuthorFixed} />
          <TitleField disabled={form.readOnly} />
          <ParticipantField disabled={form.readOnly} />
          <DateField label="훈련 날짜" disabled={form.readOnly} />
          <ImageField disabled={form.readOnly} />
        </div>
      </FormContainer>

      <DescriptionField type="training" disabled={form.readOnly} />
    </ArticleFormLayout>
  );
}

export default TrainingLogForm;
