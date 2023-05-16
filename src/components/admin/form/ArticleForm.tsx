import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader/ImageUploader";
import {
  ButtonContainer,
  CancelButton,
  FormContainer,
  InputContainer,
  StyledInput,
  StyledLabel,
  StyledTextArea,
  TagAddButton,
  TagDeleteButton,
  TagsContainer,
} from "./StyledComponent/FormContainer";
import { ValuesType } from "./Type/ArticleType";
import { ArticleInfoType } from "../../../types/ArticleInfoType";
import { Link, useNavigate } from "react-router-dom";

type ArticleFormProps = {
  apiUrl: string;
  data?: ArticleInfoType;
};

const initValues = {
  author: "",
  title: "",
  tags: [],
  description: "",
  dateTime: "",
  images: [],
};

function ArticleForm({ apiUrl, data }: ArticleFormProps) {
  const [values, setValues] = useState<ValuesType>(initValues);
  const naviagate = useNavigate();

  useEffect(() => {
    if (!data) return;
    let defaultValues: ValuesType = {
      author: data.author,
      title: data.title,
      tags: data.tags,
      description: data.description,
      dateTime: data.dateTime,
      images: [],
    };
    setValues(defaultValues);
  }, [data]);

  if (!values) return <></>;

  function handleSumbit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(values);
  }

  function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => {
      return { ...prev, author: event.target.value };
    });
  }
  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => {
      return { ...prev, title: event.target.value };
    });
  }

  function handleDescriptionChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setValues((prev) => {
      return { ...prev, description: event.target.value };
    });
  }
  function handleTagsChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    setValues((prev) => {
      let oldTags = [...prev.tags];
      oldTags[index] = event.target.value;
      return { ...prev, tags: oldTags };
    });
  }

  function handleAddTagsClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    setValues((prev) => {
      let newTags = [...prev.tags];
      newTags.push("");
      return { ...prev, tags: newTags };
    });
  }

  function handleDeleteTagClick(
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) {
    event.preventDefault();

    setValues((prev) => {
      let changedTags = [...prev.tags];

      if (index > -1) changedTags.splice(index, 1);

      return { ...prev, tags: changedTags };
    });
  }

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => {
      return { ...prev, dateTime: event.target.value };
    });
  }

  function handleCancelSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    // TODO 취소 모달 만들기
    naviagate(-1);
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSumbit}>
          <InputContainer>
            <StyledLabel htmlFor="author" aria-required="true">
              작성자
            </StyledLabel>
            <StyledInput
              id="author"
              type="text"
              name="author"
              onChange={handleAuthorChange}
              required
              value={values.author}
            />
          </InputContainer>
          <InputContainer>
            <StyledLabel htmlFor="title" aria-required="true">
              제목
            </StyledLabel>
            <StyledInput
              id="title"
              type="text"
              name="title"
              onChange={handleTitleChange}
              required
              value={values.title}
            />
          </InputContainer>
          <InputContainer>
            <StyledLabel htmlFor="tag" aria-required="true">
              참여 인원
            </StyledLabel>
            {values.tags.map((tag, index) => {
              return (
                <TagsContainer key={"tag" + index}>
                  <StyledInput
                    id="tag"
                    name="tag"
                    onChange={(event) => handleTagsChange(event, index)}
                    required
                    value={tag}
                  />
                  <TagDeleteButton
                    onClick={(event) => handleDeleteTagClick(event, index)}
                  >
                    ❌
                  </TagDeleteButton>
                </TagsContainer>
              );
            })}
            <TagAddButton onClick={handleAddTagsClick}>
              참여 인원 추가 ➕
            </TagAddButton>
          </InputContainer>
          <InputContainer>
            <StyledLabel htmlFor="date" aria-required="true">
              훈련날짜
            </StyledLabel>
            <StyledInput
              id="date"
              type="date"
              name="date"
              onChange={handleDateChange}
              required
              value={values.dateTime}
            />
          </InputContainer>
          <InputContainer>
            <StyledLabel htmlFor="description" aria-required="true">
              본문
            </StyledLabel>
            <StyledTextArea
              id="description"
              name="description"
              onChange={handleDescriptionChange}
              required
              value={values.description}
            />
          </InputContainer>
          {/* TODO 사진 올리기 */}
          <ImageUploader setValues={setValues} data={[]} />

          <ButtonContainer>
            <CancelButton onClick={handleCancelSubmit}>취소</CancelButton>
            <StyledInput type="submit" />
          </ButtonContainer>
        </form>
      </FormContainer>
    </>
  );
}

export default ArticleForm;
