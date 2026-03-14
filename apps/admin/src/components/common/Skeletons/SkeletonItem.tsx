import { cn } from "@/shared/lib/utils";
import React from "react";

type SkeletonItemProps = {
  className?: string;
  children?: React.ReactNode;
};

const SkeletonItem = ({ className, children }: SkeletonItemProps) => {
  return (
    <div
      className={cn(
        "relative w-full h-full bg-theme-light-grey overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
      {children}
    </div>
  );
};

export default SkeletonItem;
