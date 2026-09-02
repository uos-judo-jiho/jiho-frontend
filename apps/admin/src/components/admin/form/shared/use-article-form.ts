import { openConfirmDialog } from "@/components/common/Modals";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { v2Admin, v2Api } from "@packages/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  EMPTY_ARTICLE_VALUES,
  articleFormSchema,
  galleryFormSchema,
  type ArticleFormValues,
} from "../lib/article-schema";
import {
  getArticlePermission,
  type ArticleBoardType,
} from "../lib/article-permission";

export type { ArticleFormValues };

export type UseArticleFormOptions = {
  type: ArticleBoardType;
  data?: ArticleInfoType;
  /** 갤러리 모드. 게시글이 아니라 연도별 사진만 저장한다. */
  gallery?: boolean;
};

/**
 * 지호지·훈련일지·공지사항 폼이 공유하는 값·권한·저장 로직.
 *
 * 값은 react-hook-form 이 들고, 검증은 zod 스키마가 한다. 필드 컴포넌트는
 * FormProvider 를 통해 직접 register/useController 로 붙으므로 value·onChange 를
 * 폼마다 내려줄 필요가 없다.
 *
 * 세 게시판은 화면이 갈라지더라도 저장·삭제 경로(`/api/v2/admin/board`)와 권한
 * 규칙이 같아서, 그 부분만 여기에 모은다.
 */
export const useArticleForm = ({
  type,
  data,
  gallery = false,
}: UseArticleFormOptions) => {
  const { data: meData } = v2Admin.useGetMyProfileSuspense({
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

  const methods = useForm<ArticleFormValues>({
    resolver: zodResolver(gallery ? galleryFormSchema : articleFormSchema),
    defaultValues: data ?? {
      ...EMPTY_ARTICLE_VALUES,
      author: myAuthorString,
    },
  });

  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isNew = !data;
  const readOnly = !canEdit;
  // 임원 미만 등급은 게시판 종류와 무관하게 작성자가 본인으로 고정된다.
  const isAuthorFixed = !canEditAuthor;

  const queryKeyByType = {
    news: v2Api.getListLatestNewsQueryKey().filter((key) => key !== "latest"),
    training: v2Api.getListTrainingLogsQueryKey(),
    notice: v2Api.getListNoticesQueryKey(),
  } as const;

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeyByType[type] });

  const listHref = `/${type}/${gallery ? "gallery" : ""}`;

  const createBoardMutation = v2Admin.useCreateBoard({
    mutation: {
      onSuccess: async () => {
        await invalidateList();
        toast.success("게시물이 성공적으로 등록되었습니다.");
        navigate({ href: listHref });
      },
      onError: (error) => {
        console.error("board create failed:", error);
        toast.error("업로드에 실패하였습니다.");
      },
    },
    axios: { withCredentials: true },
  });

  const updateBoardMutation = v2Admin.useUpdateBoard({
    mutation: {
      onSuccess: async () => {
        await invalidateList();
        toast.success("업데이트에 성공하였습니다.");
        navigate({ href: listHref });
      },
      onError: (error) => {
        console.error("board update failed:", error);
        toast.error("업데이트에 실패하였습니다.");
      },
    },
    axios: { withCredentials: true },
  });

  const deleteBoardMutation = v2Admin.useDeleteBoard({
    mutation: {
      onSuccess: async () => {
        await invalidateList();
        toast.success("게시물이 성공적으로 삭제되었습니다.");
        navigate({ href: `/${type}` });
      },
      onError: (error) => {
        console.error("board delete failed:", error);
        toast.error("게시물 삭제에 실패하였습니다.");
      },
    },
    axios: { withCredentials: true },
  });

  const uploadPicturesMutation = v2Admin.useUploadGalleryPictures({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: async (_response, { year }) => {
        await queryClient.invalidateQueries({ queryKey: queryKeyByType.news });
        toast.success("이미지가 성공적으로 업로드되었습니다.");
        navigate({ href: `/news/${year}/gallery` });
      },
      onError: (error) => {
        console.error("gallery upload failed:", error);
        toast.error("이미지 업로드에 실패했습니다.");
      },
    },
  });

  /** 저장·삭제가 도는 동안 화면을 덮는다. 어느 뮤테이션이든 진행 중이면 true. */
  const isSubmitting =
    createBoardMutation.isPending ||
    updateBoardMutation.isPending ||
    deleteBoardMutation.isPending ||
    uploadPicturesMutation.isPending;

  const toBoardPayload = (values: ArticleFormValues) => ({
    title: values.title,
    author: values.author,
    boardType: type,
    dateTime: values.dateTime,
    description: values.description,
    tags: values.tags,
    // 쓰기도 읽기와 같은 모양의 images 를 받으므로 폼 값을 그대로 넘긴다 (api#40)
    images: values.images,
  });

  // 검증을 통과했을 때만 확인 모달이 뜬다. 성공·실패 처리는 각 뮤테이션의
  // onSuccess/onError 에 있으므로 여기서는 어느 요청을 보낼지만 정한다.
  const submit = methods.handleSubmit(async (values) => {
    const confirmed = await openConfirmDialog({
      title: isNew ? "작성한 글 저장" : "변경사항 저장",
      description: `${isNew ? "작성한 글" : "변경사항"}을 저장하시겠습니까?`,
    });

    if (!confirmed) {
      return;
    }

    if (gallery) {
      const year = Number(values.dateTime.slice(0, 4));

      if (Number.isNaN(year)) {
        toast.error("유효하지 않은 연도입니다.");
        return;
      }

      uploadPicturesMutation.mutate({
        year,
        // 갤러리 업로드(uploadGalleryPictures)는 아직 imgSrcs(string[]) 만
        // 받는다. 게시글 쓰기와 달리 여기서는 평탄화가 남아 있어야 한다.
        data: { imgSrcs: values.images.map(({ originSrc }) => originSrc) },
      });
      return;
    }

    if (isNew) {
      createBoardMutation.mutate({ data: toBoardPayload(values) });
      return;
    }

    const boardId = Number(data.id);

    if (Number.isNaN(boardId)) {
      toast.error("유효하지 않은 게시글 ID입니다.");
      return;
    }

    updateBoardMutation.mutate({ boardId, data: toBoardPayload(values) });
  });

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

    const boardId = Number(data?.id);

    if (Number.isNaN(boardId)) {
      toast.error("유효하지 않은 게시글 ID입니다.");
      return;
    }

    deleteBoardMutation.mutate({ boardId });
  };

  const cancel = () => router.history.back();

  return {
    methods,
    isNew,
    gallery,
    canEdit,
    readOnly,
    isAuthorFixed,
    isSubmitting,
    submit,
    remove,
    cancel,
  };
};

export type ArticleFormController = ReturnType<typeof useArticleForm>;
