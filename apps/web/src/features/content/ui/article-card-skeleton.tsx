import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

/** ArticleCard 와 같은 높이를 차지해 로딩 중 레이아웃이 흔들리지 않게 한다. */
export const ArticleCardSkeleton = ({
  variant = "default",
}: {
  variant?: "default" | "featured";
}) => (
  <div className="flex flex-col gap-4">
    <Skeleton
      className={cn(
        "w-full",
        variant === "featured" ? "aspect-16/9" : "aspect-3/2",
      )}
    />
    <div className="flex flex-col gap-2.5">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);
