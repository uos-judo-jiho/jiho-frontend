import { Button } from "@/components/ui/button";
import { overlay } from "overlay-kit";
import React from "react";
import { CommonModal } from "./CommonModal";

type ConfirmDialogOptions = {
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** 삭제처럼 되돌릴 수 없는 작업이면 확인 버튼을 경고 색으로 보여준다. */
  destructive?: boolean;
};

/**
 * 확인/취소를 묻고 결과를 Promise 로 돌려준다.
 *
 * 모달 열림 여부를 컴포넌트 state 로 들고 다니지 않아도 되도록 overlay-kit 을 쓴다.
 * 부르는 쪽은 `if (!(await openConfirmDialog(...))) return;` 처럼 흐름을 그대로 이어
 * 쓸 수 있어서, "무엇을 물어볼지"와 "물어본 뒤 무엇을 할지"가 한 곳에 남는다.
 */
export const openConfirmDialog = ({
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  destructive = false,
}: ConfirmDialogOptions) =>
  overlay.openAsync<boolean>(({ isOpen, close }) => (
    <CommonModal
      isOpen={isOpen}
      onClose={() => close(false)}
      title={title}
      description={description}
      maxWidth="max-w-sm"
      footer={
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => close(false)}
          >
            {cancelText}
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            className="flex-1"
            onClick={() => close(true)}
          >
            {confirmText}
          </Button>
        </div>
      }
    />
  ));
