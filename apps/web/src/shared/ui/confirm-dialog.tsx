import { overlay } from "overlay-kit";
import { useCallback, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { Overlay } from "@/shared/ui/overlay";

type ConfirmDialogOptions = {
  title: string;
  description?: ReactNode;
  /** 확인 버튼 문구 */
  confirmLabel?: string;
  /** 취소 버튼 문구 */
  cancelLabel?: string;
};

type ConfirmDialogProps = ConfirmDialogOptions & {
  open: boolean;
  /** 확인이면 true, 취소·Esc·바깥 클릭이면 false */
  onResolve: (confirmed: boolean) => void;
};

/**
 * 확인/취소 두 갈래짜리 안내 모달.
 *
 * 포털·포커스 트랩·Esc·바깥 클릭·스크롤 잠금은 전부 `Overlay` 가 맡는다.
 * 여기서는 지면(제목·설명·버튼 두 개)만 그린다.
 */
export const ConfirmDialog = ({
  open,
  onResolve,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
}: ConfirmDialogProps) => {
  // useDismiss 가 의존성으로 들고 있어서, 매 렌더마다 새 함수를 넘기면
  // Esc·바깥클릭 리스너가 그때마다 다시 등록된다
  const cancel = useCallback(() => onResolve(false), [onResolve]);

  return (
    <Overlay
      open={open}
      onClose={cancel}
      label={title}
      panelClassName={cn(
        "mx-gutter w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200",
      )}
    >
      <h2 className="jd-keep-all text-subheading text-ink-strong">{title}</h2>
      {description ? (
        <p className="jd-keep-all mt-2 text-caption text-ink-muted">
          {description}
        </p>
      ) : null}

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={cancel}
          className="rounded-full border border-line px-4 py-2 text-caption text-ink-muted transition-colors duration-200 ease-brand hover:border-line-strong hover:text-ink-strong"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => onResolve(true)}
          className="rounded-full bg-ink-strong px-4 py-2 text-caption font-medium text-on-inverse transition-colors duration-200 ease-brand hover:bg-ink"
        >
          {confirmLabel}
        </button>
      </div>
    </Overlay>
  );
};

/**
 * 선언적으로 확인 모달을 띄우고 사용자의 선택을 기다린다.
 *
 * ```ts
 * if (await openConfirmDialog({ title: "로그인이 필요해요" })) { ... }
 * ```
 *
 * overlay-kit 이 컴포넌트 트리 밖에서 모달을 렌더하므로, 호출부는 `useState`
 * 로 열림 상태를 들고 있을 필요 없이 이벤트 핸들러 안에서 곧바로 부를 수 있다.
 * (프로바이더는 `routes/__root.tsx` 에 있다.)
 */
export const openConfirmDialog = (options: ConfirmDialogOptions) =>
  overlay.openAsync<boolean>(({ isOpen, close, unmount }) => (
    <ConfirmDialog
      {...options}
      open={isOpen}
      onResolve={(confirmed) => {
        close(confirmed);
        // 퇴장 애니메이션이 없으므로 닫는 즉시 정리한다
        unmount();
      }}
    />
  ));
