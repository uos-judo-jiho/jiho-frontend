import { cn } from "@/shared/lib/utils";
import React from "react";
import { Footer } from "../common/Footer";

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
        "flex flex-col min-h-screen",
        className,
      )}
      style={{ paddingTop: `${paddingTop}px` }}
    >
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default SheetWrapper;
