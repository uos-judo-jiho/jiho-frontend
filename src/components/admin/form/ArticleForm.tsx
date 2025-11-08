import { deleteBoard, updateBoard, uploadBoard } from "@/api/admin/board";
import { uploadPicture } from "@/api/admin/pictures";
import SubmitModal from "@/components/common/Modals/AlertModals/SubmitModal";
import Loading from "@/components/common/Skeletons/Loading";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ImageUploader from "./ImageUploader/ImageUploader";
import {
  ButtonContainer,
  FormContainer,
  InputContainer,
  StyledLabel,
  TagDeleteButton,
  TagsContainer,
} from "./StyledComponent/FormContainer";

import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toBase64 } from "@/lib/utils/Utils";
import MarkdownEditor from "./MarkdownEditor/MarkdownEditor";

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
      replace(`/admin/${type}`);
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
    const tagValue = event.target.value;
    setValues((prev) => {
      let oldTags = [...prev.tags];
      oldTags[index] = tagValue;
      return { ...prev, tags: oldTags };
    });
  };

  const handleTagAdd = () => {
    const inputElement = document.getElementById(
      "tagInput"
    ) as HTMLInputElement;

    const inputValue = inputElement.value;
    const newTags = inputValue
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setValues((prev) => {
      // newTags 만큰 빈칸 추가
      let updatedTags = [...prev.tags, ...newTags];
      return { ...prev, tags: updatedTags };
    });
    inputElement.value = "";
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

  const handleUploadImages = (images: (prev: string[]) => string[]) => {
    setValues((prev) => {
      return {
        ...prev,
        imgSrcs: [...images(prev.imgSrcs)],
      };
    });
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      // S3에 업로드 (이 함수는 레거시 용도로, 드래그 앤 드롭은 MarkdownEditor 내부에서 처리됨)
      // 여기서는 임시로 base64를 반환하지만, 실제로는 S3 URL이 반환되어야 함
      const base64String = await toBase64(file);
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
                  placeholder="34기 김영민 (컴과 18) 혹은 김영민"
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
                  placeholder="제목을 입력하세요"
                  required
                  value={values.title}
                />
              </InputContainer>
              <InputContainer>
                <StyledLabel htmlFor="tag0">
                  {type === "training" ? "참여 인원" : "태그"}
                </StyledLabel>
                <hr className="my-2" />
                {/* TIP: 여러 태그를 입력할 때는 ,로 구분하세요 */}
                <div className="mb-2">
                  <small className="text-gray-500">
                    TIP: 여러 {type === "training" ? "참여 인원" : "태그"}을
                    입력할 때는 ,로 구분하세요
                  </small>
                </div>
                {/* 태그 입력란 */}
                <div className="flex flex-row items-center mb-2 gap-4">
                  <Input
                    disabled={gallery}
                    id="tagInput"
                    type="text"
                    name="tagInput"
                    placeholder={
                      type === "training"
                        ? "참여 인원을 입력하세요 (예: 김영민, 이지호)"
                        : "태그를 입력하세요 (예: 대회, 행사, 공지)"
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleTagAdd();
                      }
                    }}
                  />
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      handleTagAdd();
                    }}
                  >
                    태그 추가
                  </Button>
                </div>
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
            <div className="flex flex-col">
              <span>본문 (마크다운 지원)</span>
              <small>
                본문 내부에 이미지를 넣으려면 이미지를 드래그 앤 드랍하세요
              </small>
            </div>
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

      {!gallery && (
        <>
          <div className="mt-4 py-2 border-t-2 border-b-2 border-gray-300">
            <div className="font-bold text-lg">
              본문 미리보기{" "}
              <span className="text-gray-500 font-normal text-sm">
                (작성한 내용이 어떻게 보이는지 확인하세요)
              </span>
            </div>
            <small>첨부 이미지 미포함</small>
          </div>
          <ModalDescriptionSection
            article={{ ...values, id: "preview-id" }}
            titles={
              type === "news"
                ? ["작성자", "카테고리", "작성일"]
                : ["작성자", "참여 인원", "훈련 날짜"]
            }
          />
        </>
      )}
    </>
  );
}

export default ArticleForm;
