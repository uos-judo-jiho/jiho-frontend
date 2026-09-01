import SubmitModal from "@/components/common/Modals/AlertModals/SubmitModal";
import Loading from "@/components/common/Skeletons/Loading";
import { Badge } from "@/components/common/badge";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonContainer } from "../StyledComponent/FormContainer";
import type { ArticleFormController } from "./use-article-form";

type ArticleFormLayoutProps = {
  form: ArticleFormController;
  title: string;
  icon: LucideIcon;
  /** 헤더와 액션 버튼 사이에 들어가는 입력 영역. */
  children: ReactNode;
  /** 액션 버튼 아래에 붙는 영역 (본문 미리보기 등). */
  footer?: ReactNode;
};

/**
 * 게시판별 폼이 공유하는 껍데기 — 헤더 / 액션 버튼 / 확인 모달 / 저장 오버레이.
 *
 * 입력 필드 구성은 게시판마다 달라지므로 children 으로 통째로 받는다.
 */
export const ArticleFormLayout = ({
  form,
  title,
  icon,
  children,
  footer,
}: ArticleFormLayoutProps) => (
  <>
    <PageHeader
      title={title}
      icon={icon}
      badge={form.readOnly ? <Badge theme="gray">보기 전용</Badge> : null}
      className="mb-6"
    />

    {children}

    <ButtonContainer>
      {!form.isNew && !form.gallery && form.canEdit && (
        <Button
          variant="destructive"
          className="mr-2"
          onClick={(event) => {
            event.preventDefault();
            form.setIsDeleteOpen(true);
          }}
        >
          삭제
        </Button>
      )}
      <div className="flex gap-2 w-full justify-end">
        <Button
          className="text-primary bg-gray-300 hover:bg-gray-500"
          variant="secondary"
          onClick={(event) => {
            event.preventDefault();
            form.cancel();
          }}
        >
          {form.canEdit ? "취소" : "목록으로"}
        </Button>
        {form.canEdit && (
          <Button
            variant="default"
            className="text-primary bg-blue-500 hover:bg-blue-600"
            onClick={() => form.setIsSubmitOpen(true)}
          >
            제출
          </Button>
        )}
      </div>
    </ButtonContainer>

    <SubmitModal
      confirmText="확인"
      cancelText="취소"
      description={`${!form.isNew ? "변경사항" : "작성한 글"}을 저장하시겠습니까?`}
      open={form.isSubmitOpen}
      setOpen={form.setIsSubmitOpen}
      onSubmit={form.submit}
    />
    {!form.isNew && (
      <SubmitModal
        confirmText="삭제"
        cancelText="취소"
        description="게시물을 삭제할까요?"
        open={form.isDeleteOpen}
        setOpen={form.setIsDeleteOpen}
        onSubmit={form.remove}
      />
    )}

    {form.isSubmitting && (
      <div className="fixed top-0 right-0 bottom-0 left-0 z-10 bg-black/60">
        <div className="flex justify-center items-center h-full">
          <Loading />
        </div>
      </div>
    )}

    {footer}
  </>
);
