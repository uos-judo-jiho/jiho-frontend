import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postBoard } from "../../../api/postBoard";
import { ArticleInfoType } from "../../../types/ArticleInfoType";
import { getImageFileFromSrc } from "../../../utils/Utils";
import SubmitModal from "../../Modals/AlertModals/SubmitModal";
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

type ArticleFormProps = {
  data?: ArticleInfoType;
  type: string;
};

const initValues = {
  author: "",
  title: "",
  tags: [],
  description: "",
  dateTime: "",
  images: [],
};

function ArticleForm({ data, type }: ArticleFormProps) {
  const [values, setValues] = useState<ValuesType>(initValues);
  const [open, setOpen] = useState<boolean>(false);
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

    async function _convertFileFromSrc() {
      let defaultFiles: File[] = [];
      data?.imgSrcs.map(async (previewImgsrc, index) => {
        const imgSrc = previewImgsrc;
        const file = await getImageFileFromSrc(imgSrc, index.toString());
        if (file) {
          defaultFiles.push(file);
        }
      });
      if (defaultFiles) {
        defaultValues = { ...defaultValues, images: defaultFiles };
      }
    }
    _convertFileFromSrc();

    setValues(defaultValues);
  }, [data]);

  if (!values) return <></>;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (open) {
      // TODO API CALL
      const res = await postBoard(type, values);
      console.log(values);
      console.log(res);
    } else {
      setOpen(true);
    }
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
        <form onSubmit={handleSubmit}>
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
            <StyledLabel htmlFor="tag0">
              {type === "training" ? "참여 인원" : "태그"}
            </StyledLabel>
            {values.tags.map((tag, index) => {
              return (
                <TagsContainer key={"tag" + index}>
                  {index + 1}
                  <StyledInput
                    id={"tag" + index}
                    name={"tag" + index}
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
              {type === "training" ? "참여 인원" : "태그"} +
            </TagAddButton>
          </InputContainer>
          <InputContainer>
            <StyledLabel htmlFor="date" aria-required="true">
              날짜
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
          <ImageUploader setValues={setValues} data={data?.imgSrcs} />
          <ButtonContainer>
            <CancelButton onClick={handleCancelSubmit}>취소</CancelButton>
            <StyledInput type="submit" />
          </ButtonContainer>
          <SubmitModal
            confirmText={"확인"}
            cancelText={"취소"}
            description={"변경사항을 저장하시겠습니까?"}
            open={open}
            setOpen={setOpen}
          />
        </form>
      </FormContainer>
    </>
  );
}

export default ArticleForm;
