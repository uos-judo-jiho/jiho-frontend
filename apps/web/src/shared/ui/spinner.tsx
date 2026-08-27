import { cn } from "@/shared/lib/utils";

type SpinnerProps = {
  className?: string;
  label?: string;
};

/** 전체 화면 로딩 표시. 페이지 단위 대기에만 쓰고, 목록에는 Skeleton 을 쓴다. */
export const Spinner = ({ className, label = "불러오는 중" }: SpinnerProps) => (
  <div
    role="status"
    aria-label={label}
    className={cn("flex w-full items-center justify-center py-24", className)}
  >
    <span className="size-8 animate-spin rounded-full border-2 border-line border-t-ink-strong" />
    <span className="sr-only">{label}</span>
  </div>
);
