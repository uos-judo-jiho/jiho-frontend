import SubmitModal from "@/components/common/Modals/AlertModals/SubmitModal";
import Loading from "@/components/common/Skeletons/Loading";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { v2Admin, v2Api } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { toBase64 } from "@/shared/lib/utils/Utils";
import MarkdownEditorField from "./MarkdownEditor/MarkdownEditorField";

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

function ArticleForm({ data, type, gallery }: ArticleFormProps) {
  const [values, setValues] = useState<Omit<ArticleInfoType, "id">>(
    data ?? initValues,
  );
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const naviagate = useNavigate();
  const queryClient = useQueryClient();

  const queryKeyByType = {
    news: v2Api.getGetApiV2NewsLatestQueryKey(),
    training: v2Api.getGetApiV2TrainingsQueryKey(),
    notice: v2Api.getGetApiV2NoticesQueryKey(),
  } as const;

  const isNew = !data;

  const createBoardMutation = v2Admin.usePostApiV2AdminBoard({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeyByType[type]] });
      },
    },
    axios: {
      withCredentials: true,
    },
  });

  const updateBoardMutation = v2Admin.usePutApiV2AdminBoardBoardId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeyByType[type]] });
      },
    },
    axios: {
      withCredentials: true,
    },
  });

  const deleteBoardMutation = v2Admin.useDeleteApiV2AdminBoardBoardId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeyByType[type]] });
      },
    },
    axios: {
      withCredentials: true,
    },
  });

  const uploadPicturesMutation = v2Admin.usePostApiV2AdminPicturesYear({
    axios: {
      withCredentials: true,
    },
  });

  const handleSubmitOpen = () => setIsSubmitOpen(true);

  const handleDelete = async (
    id: string | number,
    type: "news" | "training" | "notice",
  ) => {
    try {
      const boardId = Number(id);
      if (Number.isNaN(boardId)) {
        throw new Error("유효하지 않은 게시글 ID입니다.");
      }

      await deleteBoardMutation.mutateAsync({ boardId });
      naviagate(`/${type}`);
    } catch (error) {
      console.error(error);
      alert("게시물을 삭제에 실패하였습니다!");
    }
  };

  const handleSubmit = async () => {
    setIsSubmited(true);

    try {
      if (gallery) {
        const yearNumber = Number(values.dateTime.slice(0, 4));
        if (Number.isNaN(yearNumber)) {
          throw new Error("유효하지 않은 연도입니다.");
        }

        await uploadPicturesMutation.mutateAsync({
          year: yearNumber,
          data: {
            base64Imgs: values.imgSrcs,
          },
        });
      } else {
        if (isNew) {
          await createBoardMutation.mutateAsync({
            data: {
              title: values.title,
              author: values.author,
              boardType: type,
              dateTime: values.dateTime,
              description: values.description,
              tags: values.tags,
              base64Imgs: values.imgSrcs,
            },
          });
        } else {
          const boardId = Number(data.id);
          if (Number.isNaN(boardId)) {
            throw new Error("유효하지 않은 게시글 ID입니다.");
          }

          await updateBoardMutation.mutateAsync({
            boardId,
            data: {
              title: values.title,
              author: values.author,
              boardType: type,
              dateTime: values.dateTime,
              description: values.description,
              tags: values.tags,
              base64Imgs: values.imgSrcs,
            },
          });
        }
      }

      alert("업로드에 성공하였습니다.");
      naviagate(`/${type}/${gallery ? "gallery" : ""}`);
    } catch (error) {
      console.error("upload error:", error);
      alert("업로드에 실패하였습니다.");
    } finally {
      setIsSubmited(false);
    }
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
    index: number,
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
      "tagInput",
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
    index: number,
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
            imageLimit={gallery ? 50 : 10}
          />
        </div>
      </FormContainer>
      {!gallery && (
        <MarkdownEditorField
          value={values.description}
          onChange={handleMarkdownChange}
          onImageUpload={handleImageUpload}
          type={type}
          disabled={gallery}
        />
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
            onClick={handleSubmitOpen}
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
          description={"게시물을 삭제할까요?"}
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          onSubmit={async () => handleDelete(data.id, type)}
        />
      )}

      {isSubmited && (
        <div className="fixed top-0 right-0 bottom-0 left-0 z-10 bg-black/60">
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        </div>
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
