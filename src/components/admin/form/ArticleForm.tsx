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
import MarkdownEditor from "./MarkdownEditor/MarkdownEditor";
import { toBase64 } from "@/lib/utils/Utils";

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

  const handleMarkdownChange = (value: string) => {
    setValues((prev) => {
      return { ...prev, description: value };
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

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      // 파일을 base64로 변환
      const base64String = await toBase64(file);

      // TODO 프론트엔드 서버에서 직접 s3로 업로드 처리

      return base64String;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("이미지 업로드에 실패했습니다.");
    }
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

          <ImageUploader
            setValues={handleUploadImages}
            data={data?.imgSrcs}
            imageLimit={gallery ? 20 : 10}
          />
        </div>
      </FormContainer>
      {!gallery && (
        <InputContainer>
          <StyledLabel htmlFor="description" aria-required="true">
            본문 (마크다운 지원)
          </StyledLabel>
          <MarkdownEditor
            value={values.description}
            onChange={handleMarkdownChange}
            disabled={gallery}
            onImageUpload={handleImageUpload}
            placeholder={`마크다운으로 ${
              type === "training"
                ? "훈련일지"
                : type === "news"
                ? "지호지"
                : "공지사항"
            } 내용을 작성하세요...

# 제목 예시

**굵은 글씨**와 *기울임꼴*을 사용할 수 있습니다.

## 소제목

- 리스트 항목 1
- 리스트 항목 2

### 세부 내용

1. 순서가 있는 목록
2. 두 번째 항목

> 인용구도 사용할 수 있습니다.

\`\`\`
코드 블록도 지원됩니다
\`\`\`

[링크 텍스트](https://example.com)

**💡 이미지 추가하기**
- 이미지 파일을 에디터로 드래그 앤 드롭하세요
- 자동으로 마크다운 이미지 문법이 삽입됩니다!`}
          />
        </InputContainer>
      )}

      <ButtonContainer>
        {!isNew && !gallery && (
          <Button
            variant={"destructive"}
            onClick={handleDeleteSubmit}
            className="mr-2"
          >
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
        description={`${!isNew ? "변경사항" : "작성한 글"}을 저장하시겠습니까?`}
        open={isSubmitOpen}
        setOpen={setIsSubmitOpen}
        onSubmit={async () => await handleSubmit()}
      />
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
