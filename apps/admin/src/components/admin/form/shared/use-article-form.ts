import { openConfirmDialog } from "@/components/common/Modals";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { toBase64 } from "@/shared/lib/utils/Utils";
import { v2Admin, v2Api } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  getArticlePermission,
  type ArticleBoardType,
} from "../lib/article-permission";

export type ArticleFormValues = Omit<ArticleInfoType, "id">;

const EMPTY_VALUES: ArticleFormValues = {
  author: "",
  title: "",
  tags: [],
  description: "",
  dateTime: "",
  imgSrcs: [],
};

export type UseArticleFormOptions = {
  type: ArticleBoardType;
  data?: ArticleInfoType;
  /** 갤러리 모드. 게시글이 아니라 연도별 사진만 저장한다. */
  gallery?: boolean;
};

/**
 * 지호지·훈련일지·공지사항 폼이 공유하는 상태와 저장 로직.
 *
 * 세 게시판은 화면이 갈라지더라도 저장·삭제 경로(`/api/v2/admin/board`)와 권한
 * 규칙이 같다. 그래서 화면은 각 폼이 직접 그리고, 여기서는 값·권한·뮤테이션만
 * 관리한다.
 */
export const useArticleForm = ({
  type,
  data,
  gallery = false,
}: UseArticleFormOptions) => {
  const { data: meData } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (response) => response.data,
    },
  });

  const { canEdit, canEditAuthor } = getArticlePermission({
    type,
    role: meData.user.role,
    myName: meData.user.additionalInfo?.name,
    articleAuthor: data?.author,
  });

  const myAuthorString = meData.user.additionalInfo
    ? `${meData.user.additionalInfo.generation ? meData.user.additionalInfo.generation + "기 " : ""}${meData.user.additionalInfo.name}`
    : meData.user.email;

  const [values, setValues] = useState<ArticleFormValues>(
    data ?? { ...EMPTY_VALUES, author: myAuthorString },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isNew = !data;
  const readOnly = !canEdit;
  // 임원 미만 등급은 게시판 종류와 무관하게 작성자가 본인으로 고정된다.
  const isAuthorFixed = !canEditAuthor;

  const queryKeyByType = {
    news: v2Api
      .getGetApiV2NewsLatestQueryKey()
      .filter((key) => key !== "latest"),
    training: v2Api.getGetApiV2TrainingsQueryKey(),
    notice: v2Api.getGetApiV2NoticesQueryKey(),
  } as const;

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeyByType[type] });

  const listHref = `/${type}/${gallery ? "gallery" : ""}`;

  const createBoardMutation = v2Admin.usePostApiV2AdminBoard({
    mutation: {
      onSuccess: async () => {
        await invalidateList();
        toast.success("게시물이 성공적으로 등록되었습니다.");
        navigate({ href: listHref });
      },
    },
    axios: { withCredentials: true },
  });

  const updateBoardMutation = v2Admin.usePutApiV2AdminBoardBoardId({
    mutation: {
      onSuccess: async () => {
        await invalidateList();
        toast.success("업데이트에 성공하였습니다.");
        navigate({ href: listHref });
      },
    },
    axios: { withCredentials: true },
  });

  const deleteBoardMutation = v2Admin.useDeleteApiV2AdminBoardBoardId({
    mutation: {
      onSuccess: async () => {
        await invalidateList();
        toast.success("게시물이 성공적으로 삭제되었습니다.");
        navigate({ href: `/${type}` });
      },
    },
    axios: { withCredentials: true },
  });

  const uploadPicturesMutation = v2Admin.usePostApiV2AdminPicturesYear({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeyByType.news });
        toast.success("이미지가 성공적으로 업로드되었습니다.");
        navigate({ href: `/news/${values.dateTime.slice(0, 4)}/gallery` });
      },
    },
  });

  const setField = <Key extends keyof ArticleFormValues>(
    key: Key,
    value: ArticleFormValues[Key],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const setAuthor = (author: string) => {
    if (isAuthorFixed) {
      return;
    }
    setField("author", author);
  };

  const setTags = (next: string[]) => setField("tags", next);

  /** ImageUploader 는 문자열 URL 배열만 다루므로 그 형태로 주고받는다. */
  const setImages = (update: (prev: string[]) => string[]) => {
    setValues((prev) => ({
      ...prev,
      imgSrcs: update(prev.imgSrcs.map(({ originSrc }) => originSrc)).map(
        (src) => ({ originSrc: src, smallSrc: null }),
      ),
    }));
  };

  /**
   * 본문 에디터의 레거시 업로드 경로. 드래그 앤 드롭은 MarkdownEditor 내부에서
   * S3 로 직접 올리고, 여기로 들어오는 파일은 base64 로만 인라인된다.
   */
  const uploadInlineImage = async (file: File): Promise<string> => {
    try {
      return await toBase64(file);
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  };

  const toBoardPayload = () => ({
    title: values.title,
    author: values.author,
    boardType: type,
    dateTime: values.dateTime,
    description: values.description,
    tags: values.tags,
    imgSrcs: values.imgSrcs.map(({ originSrc }) => originSrc),
  });

  const submit = async () => {
    const confirmed = await openConfirmDialog({
      title: isNew ? "작성한 글 저장" : "변경사항 저장",
      description: `${isNew ? "작성한 글" : "변경사항"}을 저장하시겠습니까?`,
    });

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (gallery) {
        const yearNumber = Number(values.dateTime.slice(0, 4));
        if (Number.isNaN(yearNumber)) {
          throw new Error("유효하지 않은 연도입니다.");
        }

        await uploadPicturesMutation.mutateAsync({
          year: yearNumber,
          data: { imgSrcs: values.imgSrcs.map(({ originSrc }) => originSrc) },
        });
      } else if (isNew) {
        await createBoardMutation.mutateAsync({ data: toBoardPayload() });
      } else {
        const boardId = Number(data.id);
        if (Number.isNaN(boardId)) {
          throw new Error("유효하지 않은 게시글 ID입니다.");
        }

        await updateBoardMutation.mutateAsync({
          boardId,
          data: toBoardPayload(),
        });
      }
    } catch (error) {
      console.error("upload error:", error);
      toast.error("업로드에 실패하였습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async () => {
    const confirmed = await openConfirmDialog({
      title: "게시물 삭제",
      description: "게시물을 삭제할까요? 삭제한 뒤에는 되돌릴 수 없습니다.",
      confirmText: "삭제",
      destructive: true,
    });

    if (!confirmed) {
      return;
    }

    try {
      const boardId = Number(data?.id);
      if (Number.isNaN(boardId)) {
        throw new Error("유효하지 않은 게시글 ID입니다.");
      }

      await deleteBoardMutation.mutateAsync({ boardId });
    } catch (error) {
      console.error(error);
      toast.error("게시물을 삭제에 실패하였습니다!");
    }
  };

  const cancel = () => router.history.back();

  return {
    values,
    isNew,
    gallery,
    canEdit,
    readOnly,
    isAuthorFixed,
    isSubmitting,
    setField,
    setAuthor,
    setTags,
    setImages,
    uploadInlineImage,
    submit,
    remove,
    cancel,
  };
};

export type ArticleFormController = ReturnType<typeof useArticleForm>;
