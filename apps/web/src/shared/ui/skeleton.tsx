import { cn } from "@/shared/lib/utils";

type SkeletonProps = {
  className?: string;
  /** 접근성 라벨 — 지정하면 스크린리더에 로딩 중임을 알린다 */
  label?: string;
};

/** 로딩 자리표시자. 크기는 항상 호출부가 className 으로 정한다. */
export const Skeleton = ({ className, label }: SkeletonProps) => (
  <div
    role={label ? "status" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    className={cn(
      "relative overflow-hidden rounded-sm bg-surface-subtle",
      className,
    )}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-line to-transparent" />
  </div>
);
