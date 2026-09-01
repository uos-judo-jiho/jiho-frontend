import { ParticipantSelect } from "@/features/user/ui/participant-select";
import { useController } from "react-hook-form";
import type { ArticleFormValues } from "../../lib/article-schema";
import {
  InputContainer,
  StyledLabel,
} from "../../StyledComponent/FormContainer";
import { FieldErrorMessage } from "./field-error";

type ParticipantFieldProps = {
  disabled?: boolean;
};

/**
 * 훈련일지 참여 인원 필드.
 *
 * 저장 형식은 기존과 같은 이름 문자열 배열(게시글 tags)이라, 이 필드로 바꿔도
 * 예전에 쓴 훈련일지와 섞이지 않는다.
 */
export const ParticipantField = ({
  disabled = false,
}: ParticipantFieldProps) => {
  const { field, fieldState } = useController<ArticleFormValues, "tags">({
    name: "tags",
  });

  return (
    <InputContainer>
      <StyledLabel htmlFor="participant-search">참여 인원</StyledLabel>
      <hr className="my-2" />
      <div className="mb-2">
        <small className="text-gray-500">
          부원 이름을 검색해 선택하세요. 아직 가입하지 않은 사람은 이름을
          입력하고 Enter 를 누르면 그대로 추가됩니다.
        </small>
      </div>
      <ParticipantSelect
        value={field.value}
        onChange={field.onChange}
        disabled={disabled}
      />
      <FieldErrorMessage error={fieldState.error} />
    </InputContainer>
  );
};
