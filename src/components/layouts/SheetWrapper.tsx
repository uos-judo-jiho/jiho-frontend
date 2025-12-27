import { cn } from "@/shared/lib/utils";
import React from "react";

type SheetWrapperProps = {
  children: React.ReactNode;
  className?: string;
  paddingTop?: number;
};

function SheetWrapper({
  children,
  paddingTop = 92,
  className,
}: SheetWrapperProps) {
  return (
    <div
      className={cn(
        "relative mx-auto",
        "w-full",
        "sm:w-[640px]",
        "md:w-[768px]",
        "lg:w-[960px]",
        className
      )}
      style={{ paddingTop: `${paddingTop}px` }}
    >
      {children}
    </div>
  );
}

export default SheetWrapper;
