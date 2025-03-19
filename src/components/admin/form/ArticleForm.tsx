import { deleteBoard, updateBoard, uploadBoard } from "@/api/admin/board";
import { uploadPicture } from "@/api/admin/pictures";
import SubmitModal from "@/components/common/Modals/AlertModals/SubmitModal";
import Loading from "@/components/common/Skeletons/Loading";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ImageUploader from "./ImageUploader/ImageUploader";
import {
  ButtonContainer,
  FormContainer,
  InputContainer,
  StyledLabel,
  TagAddButton,
  TagDeleteButton,
  TagsContainer,
} from "./StyledComponent/FormContainer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ArticleFormProps = {
  data?: ArticleInfoType;
  type: "news" | "training" | "notice";
  gallery?: boolean;
};

const initValues: Omit<ArticleInfoType, "id"> = {
  author: "",
  title: "",
  tags: [],
  description: "",
  dateTime: "",
  imgSrcs: [],
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

const InputValueLength = styled.span`
  text-align: right;
`;

function ArticleForm({ data, type, gallery }: ArticleFormProps) {
  const [values, setValues] = useState<Omit<ArticleInfoType, "id">>(
    data ?? initValues
  );
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const naviagate = useNavigate();

  const isNew = !data;

  const handelSubmitOpen = () => setIsSubmitOpen(true);

  const handleDelete = async (
    id: string,
    type: "news" | "training" | "notice"
  ) => {
    const res = await deleteBoard(id);
    if (res) {
      redirect(`/admin/${type}`);
    } else {
      alert("게시물을 삭제에 실패하였습니다!");
    }
  };

  const handleSubmit = async () => {
    setIsSubmited(true);

    let res;
    if (gallery) {
      res = await uploadPicture(values.dateTime.slice(0, 4), values.imgSrcs);
    } else {
      if (isNew) {
        res = await uploadBoard(
          {
            title: values.title,
            author: values.author,
            description: values.description,
            dateTime: values.dateTime,
            tags: values.tags,
            imgSrcs: values.imgSrcs,
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
            imgSrcs: values.imgSrcs,
          },
          type
        );
      }
    }

    if (res) {
      alert("업로드에 성공하였습니다.");
    } else {
      alert("업로드에 실패하였습니다.");
      console.error("upload error");
    }

    setIsSubmited(false);
    naviagate(`/admin/${type}/${gallery ? "gallery" : ""}`);
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

  const handleUploadImages = (images: string[]) => {
    setValues((prev) => ({ ...prev, imgSrcs: [...images] }));
  };

  return (
    <>
      <FormContainer>
        <div>
          {!gallery && (
            <>
              <InputContainer>
                <StyledLabel htmlFor="author" aria-required="true">
                  작성자
                </StyledLabel>
                <Input
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
                <Input
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
                {values.tags.map((tag, index) => (
                  <TagsContainer key={"tag" + index}>
                    {index + 1}
                    <Input
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
                ))}
                <TagAddButton onClick={handleAddTagsClick} disabled={gallery}>
                  {type === "training" ? "참여 인원" : "태그"} +
                </TagAddButton>
              </InputContainer>
            </>
          )}
          <InputContainer>
            <StyledLabel htmlFor="date" aria-required="true">
              날짜
            </StyledLabel>
            <Input
              disabled={gallery}
              id="date"
              type="date"
              name="date"
              onChange={handleDateChange}
              required
              value={values.dateTime}
            />
          </InputContainer>
          {!gallery && (
            <InputContainer>
              <StyledLabel htmlFor="description" aria-required="true">
                본문
              </StyledLabel>
              <Textarea
                disabled={gallery}
                id="description"
                name="description"
                onChange={handleDescriptionChange}
                required
                value={values.description}
              />
              <InputValueLength>{values.description.length}</InputValueLength>
            </InputContainer>
          )}
          <ImageUploader
            setValues={handleUploadImages}
            data={data?.imgSrcs}
            imageLimit={gallery ? 20 : 10}
          />

          <ButtonContainer>
            {!isNew && !gallery && (
              <Button variant={"destructive"} onClick={handleDeleteSubmit}>
                삭제
              </Button>
            )}
            <div className="flex gap-2">
              <Button
                className="text-primary bg-gray-300 hover:bg-gray-500"
                variant={"secondary"}
                onClick={handleCancelSubmit}
              >
                취소
              </Button>
              <Button
                variant={"default"}
                className="text-primary bg-blue-500 hover:bg-blue-600"
                onClick={handelSubmitOpen}
              >
                제출
              </Button>
            </div>
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
