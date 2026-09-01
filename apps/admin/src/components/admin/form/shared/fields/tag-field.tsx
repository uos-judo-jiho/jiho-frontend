import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useController } from "react-hook-form";
import type { ArticleFormValues } from "../../lib/article-schema";
import {
  InputContainer,
  StyledLabel,
  TagDeleteButton,
  TagsContainer,
} from "../../StyledComponent/FormContainer";
import { FieldErrorMessage } from "./field-error";

type TagFieldProps = {
  disabled?: boolean;
  placeholder?: string;
};

/**
 * 지호지·공지사항의 태그 입력.
 *
 * 훈련일지의 참여 인원은 부원 명부에서 고르는 별도 필드(ParticipantField)를 쓴다.
 */
export const TagField = ({
  disabled = false,
  placeholder = "태그를 입력하세요 (예: 대회, 행사, 공지)",
}: TagFieldProps) => {
  const { field, fieldState } = useController<ArticleFormValues, "tags">({
    name: "tags",
  });
  // 아직 태그가 되지 않은 입력값. 폼에 저장되는 값이 아니라 이 입력창만의 상태다.
  const [draft, setDraft] = useState("");

  const addTags = () => {
    const newTags = draft
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setDraft("");

    if (newTags.length > 0) {
      field.onChange([...field.value, ...newTags]);
    }
  };

  return (
    <InputContainer>
      <StyledLabel htmlFor="tagInput">태그</StyledLabel>
      <hr className="my-2" />
      <div className="mb-2">
        <small className="text-gray-500">
          TIP: 여러 태그를 입력할 때는 ,로 구분하세요
        </small>
      </div>
      <div className="flex flex-row items-center mb-2 gap-4">
        <Input
          id="tagInput"
          name="tagInput"
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTags();
            }
          }}
        />
        <Button
          disabled={disabled}
          onClick={(event) => {
            event.preventDefault();
            addTags();
          }}
        >
          태그 추가
        </Button>
      </div>
      {field.value.map((tag, index) => (
        <TagsContainer key={"tag" + index}>
          {index + 1}
          <Input
            id={"tag" + index}
            disabled={disabled}
            value={tag}
            onChange={(event) =>
              field.onChange(
                field.value.map((prev, current) =>
                  current === index ? event.target.value : prev,
                ),
              )
            }
          />
          <TagDeleteButton
            disabled={disabled}
            onClick={(event) => {
              event.preventDefault();
              field.onChange(
                field.value.filter((_, current) => current !== index),
              );
            }}
          >
            ❌
          </TagDeleteButton>
        </TagsContainer>
      ))}
      <FieldErrorMessage error={fieldState.error} />
    </InputContainer>
  );
};
