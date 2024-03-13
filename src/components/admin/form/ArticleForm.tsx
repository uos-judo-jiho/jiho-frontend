import { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  deleteBoard,
  updateBoard,
  uploadBoard,
} from "../../../api/admin/board";
import { ArticleInfoType } from "../../../types/ArticleInfoType";
import { getImageFileFromSrc, toBase64 } from "../../../utils/Utils";
import SubmitModal from "../../Modals/AlertModals/SubmitModal";
import Loading from "../../Skeletons/Loading";
import ImageUploader from "./ImageUploader/ImageUploader";
import {
  ButtonContainer,
  CancelButton,
  FormContainer,
  InputContainer,
  NewArticleButton,
  StyledInput,
  StyledLabel,
  StyledTextArea,
  TagAddButton,
  TagDeleteButton,
  TagsContainer,
} from "./StyledComponent/FormContainer";
import { ArticleType } from "./Type/ArticleType";
import { uploadPicture } from "../../../api/admin/pictures";

type ArticleFormProps = {
  data?: ArticleInfoType;
  type: "news" | "training" | "notice";
  gallery?: boolean;
};

const initValues = {
  author: "",
  title: "",
  tags: [],
  description: "",
  dateTime: "",
  images: [],
};

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.6);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

function ArticleForm({ data, type, gallery }: ArticleFormProps) {
  const [values, setValues] = useState<ArticleType>(initValues);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const naviagate = useNavigate();

  const isNew = !data;

  useEffect(() => {
    if (!data) return;
    let defaultValues: ArticleType = {
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

  const handelSubmitOpen = () => setIsSubmitOpen(true);

  const handleDelete = async (
    id: string,
    type: "news" | "training" | "notice"
  ) => {
    const res = await deleteBoard(id);
    if (res) {
      alert("게시물을 삭제하였습니다!");
      redirect(`/admin/${type}`);
    } else {
      alert("게시물을 삭제에 실패하였습니다!");
    }
  };

  const handleSubmit = async () => {
    setIsSubmited(true);

    const images: string[] = [];
    for await (const imgs of values.images) {
      const imgBase64 = await toBase64(imgs);
      if (typeof imgBase64 === "string") {
        images.push(imgBase64);
      }
    }
    let res;
    if (gallery) {
      res = await uploadPicture(values.dateTime.slice(0, 4), images);
    } else {
      if (isNew) {
        res = await uploadBoard(
          {
            title: values.title,
            author: values.author,
            description: values.description,
            dateTime: values.dateTime,
            tags: values.tags,
            imgSrcs: images,
          },
          type
        );
      } else {
        res = await updateBoard(
          {
            id: data.id,
            title: values.title,
            author: values.author,
            description: values.description,
            dateTime: values.dateTime,
            tags: values.tags,
            imgSrcs: images,
          },
          type
        );
      }
    }

    if (!res) {
      console.error("upload error");
      alert("업로드에 실패하였습니다.");
    }

    setIsSubmited(false);
    naviagate(`/admin/${type}/${gallery ? "gallery" : ""}`);
    alert("업로드에 성공하였습니다.");
  };

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => {
      return { ...prev, author: event.target.value };
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => {
      return { ...prev, title: event.target.value };
    });
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValues((prev) => {
      return { ...prev, description: event.target.value };
    });
  };

  const handleTagsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setValues((prev) => {
      let oldTags = [...prev.tags];
      oldTags[index] = event.target.value;
      return { ...prev, tags: oldTags };
    });
  };

  const handleAddTagsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setValues((prev) => {
      let newTags = [...prev.tags];
      newTags.push("");
      return { ...prev, tags: newTags };
    });
  };

  const handleDeleteTagClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.preventDefault();

    setValues((prev) => {
      let changedTags = [...prev.tags];

      if (index > -1) changedTags.splice(index, 1);

      return { ...prev, tags: changedTags };
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => {
      return { ...prev, dateTime: event.target.value };
    });
  };

  const handleCancelSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    naviagate(-1);
  };

  const handleDeleteSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDeleteOpen(true);
  };

  return (
    <>
      <FormContainer>
        <div>
          <InputContainer>
            <StyledLabel htmlFor="author" aria-required="true">
              작성자
            </StyledLabel>
            <StyledInput
              disabled={gallery}
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
              disabled={gallery}
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
                    disabled={gallery}
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
            <TagAddButton onClick={handleAddTagsClick} disabled={gallery}>
              {type === "training" ? "참여 인원" : "태그"} +
            </TagAddButton>
          </InputContainer>
          <InputContainer>
            <StyledLabel htmlFor="date" aria-required="true">
              날짜
            </StyledLabel>
            <StyledInput
              disabled={gallery}
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
              disabled={gallery}
              id="description"
              name="description"
              onChange={handleDescriptionChange}
              required
              value={values.description}
            />
          </InputContainer>
          <ImageUploader
            setValues={setValues}
            data={data?.imgSrcs}
            imageLimit={gallery ? 20 : 10}
          />
          <ButtonContainer>
            {!isNew && !gallery && (
              <CancelButton onClick={handleDeleteSubmit}>삭제</CancelButton>
            )}
            <>
              <CancelButton onClick={handleCancelSubmit}>취소</CancelButton>
              <NewArticleButton onClick={handelSubmitOpen}>
                제출
              </NewArticleButton>
            </>
          </ButtonContainer>
          <SubmitModal
            confirmText={"확인"}
            cancelText={"취소"}
            description={`${
              !isNew ? "변경사항" : "작성한 글"
            }을 저장하시겠습니까?`}
            open={isSubmitOpen}
            setOpen={setIsSubmitOpen}
            onSubmit={async () => await handleSubmit()}
          />
        </div>
        {!isNew && (
          <SubmitModal
            confirmText={"삭제"}
            cancelText={"취소"}
            description={"게시물을 삭제하기겠습니까?"}
            open={isDeleteOpen}
            setOpen={setIsDeleteOpen}
            onSubmit={async () => handleDelete(data.id, type)}
          />
        )}
      </FormContainer>
      {isSubmited && (
        <LoadingWrapper>
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        </LoadingWrapper>
      )}
    </>
  );
}

export default ArticleForm;
