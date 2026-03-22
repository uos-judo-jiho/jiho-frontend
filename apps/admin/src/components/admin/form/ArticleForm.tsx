import SubmitModal from "@/components/common/Modals/AlertModals/SubmitModal";
import Loading from "@/components/common/Skeletons/Loading";
import { Badge } from "@/components/common/badge";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { v2Admin, v2Api } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, BookOpen, Newspaper } from "lucide-react";
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
import { toast } from "sonner";
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
  const { data: meData } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data,
    },
  });

  const userRole = meData.user.role;
  const StaffAndAbove = ["root", "president", "manager", "staff"];
  const GeneralAndAbove = [...StaffAndAbove, "general"];

  const isRootOrPresident = ["root", "president"].includes(userRole);
  const myName = meData.user.additionalInfo?.name;

  // Root/President는 모든 글 수정 가능, 그 외에는 본인이 작성한 글(이름 포함)만 수정 가능
  const isAuthor = !data || (myName && data.author.includes(myName));

  const roleCanEditType =
    type === "training"
      ? GeneralAndAbove.includes(userRole)
      : StaffAndAbove.includes(userRole);

  // Permission logic
  const canEdit = roleCanEditType && (isRootOrPresident || isAuthor);

  const readOnly = !canEdit;

  const getHeaderInfo = () => {
    const isEdit = !!data;
    if (gallery) {
      return {
        title: `${values.dateTime.slice(0, 4)}년 갤러리 작성`,
        icon: Newspaper,
      };
    }
    switch (type) {
      case "news":
        return {
          title: isEdit ? "지호지 수정" : "지호지 글쓰기",
          icon: Newspaper,
        };
      case "training":
        return {
          title: isEdit ? "훈련일지 수정" : "훈련일지 글쓰기",
          icon: BookOpen,
        };
      case "notice":
        return {
          title: isEdit ? "공지사항 수정" : "공지사항 글쓰기",
          icon: Bell,
        };
      default:
        return { title: "게시글", icon: Newspaper };
    }
  };

  const myAuthorString = meData.user.additionalInfo
    ? `${meData.user.additionalInfo.generation}기 ${meData.user.additionalInfo.name}`
    : meData.user.email;

  const [values, setValues] = useState<Omit<ArticleInfoType, "id">>(
    data ?? { ...initValues, author: myAuthorString },
  );

  const headerInfo = getHeaderInfo();

  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const naviagate = useNavigate();
  const queryClient = useQueryClient();

  const queryKeyByType = {
    news: v2Api
      .getGetApiV2NewsLatestQueryKey()
      .filter((key) => key !== "latest"),
    training: v2Api.getGetApiV2TrainingsQueryKey(),
    notice: v2Api.getGetApiV2NoticesQueryKey(),
  } as const;

  const isNew = !data;

  const createBoardMutation = v2Admin.usePostApiV2AdminBoard({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKeyByType[type],
        });
        toast.success("게시물이 성공적으로 등록되었습니다.");
        naviagate(`/${type}/${gallery ? "gallery" : ""}`);
      },
    },
    axios: {
      withCredentials: true,
    },
  });

  const updateBoardMutation = v2Admin.usePutApiV2AdminBoardBoardId({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKeyByType[type],
        });

        toast.success("업데이트에 성공하였습니다.");
        naviagate(`/${type}/${gallery ? "gallery" : ""}`);
      },
    },
    axios: {
      withCredentials: true,
    },
  });

  const deleteBoardMutation = v2Admin.useDeleteApiV2AdminBoardBoardId({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKeyByType[type],
        });
        toast.success("게시물이 성공적으로 삭제되었습니다.");
        naviagate(`/${type}`);
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

  const handleDelete = async (id: string | number) => {
    try {
      const boardId = Number(id);
      if (Number.isNaN(boardId)) {
        throw new Error("유효하지 않은 게시글 ID입니다.");
      }

      if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
        return;
      }

      await deleteBoardMutation.mutateAsync({ boardId });
    } catch (error) {
      console.error(error);
      toast.error("게시물을 삭제에 실패하였습니다!");
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
              imgSrcs: values.imgSrcs,
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
              imgSrcs: values.imgSrcs,
            },
          });
        }
      }
    } catch (error) {
      console.error("upload error:", error);
      toast.error("업로드에 실패하였습니다.");
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
      <PageHeader
        title={headerInfo.title}
        icon={headerInfo.icon}
        badge={readOnly ? <Badge theme="gray">보기 전용</Badge> : null}
        className="mb-6"
      />
      <FormContainer>
        <div>
          {!gallery && (
            <>
              <InputContainer>
                <StyledLabel htmlFor="author" aria-required="true">
                  작성자
                </StyledLabel>
                <Input
                  disabled={readOnly || gallery}
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
                  disabled={readOnly || gallery}
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
                    disabled={readOnly || gallery}
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
                    disabled={readOnly}
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
                      disabled={readOnly || gallery}
                      id={"tag" + index}
                      name={"tag" + index}
                      onChange={(event) => handleTagsChange(event, index)}
                      required
                      value={tag}
                    />
                    <TagDeleteButton
                      disabled={readOnly}
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
              disabled={readOnly || gallery}
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
            disabled={readOnly}
          />
        </div>
      </FormContainer>
      {!gallery && (
        <MarkdownEditorField
          value={values.description}
          onChange={handleMarkdownChange}
          onImageUpload={handleImageUpload}
          type={type}
          disabled={readOnly || gallery}
        />
      )}

      <ButtonContainer>
        {!isNew && !gallery && canEdit && (
          <Button
            variant={"destructive"}
            onClick={handleDeleteSubmit}
            className="mr-2"
          >
            삭제
          </Button>
        )}
        <div className="flex gap-2 w-full justify-end">
          <Button
            className="text-primary bg-gray-300 hover:bg-gray-500"
            variant={"secondary"}
            onClick={handleCancelSubmit}
          >
            {canEdit ? "취소" : "목록으로"}
          </Button>
          {canEdit && (
            <Button
              variant={"default"}
              className="text-primary bg-blue-500 hover:bg-blue-600"
              onClick={handleSubmitOpen}
            >
              제출
            </Button>
          )}
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
          onSubmit={async () => await handleDelete(data.id)}
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