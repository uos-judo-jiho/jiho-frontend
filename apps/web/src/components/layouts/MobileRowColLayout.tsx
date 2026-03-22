import { cn } from "@/shared/lib/utils";
import React from "react";

type MobileRowColLayoutProps = {
  children: React.ReactNode;
  rowJustifyContent?: string;
  rowAlignItems?: string;
  colJustifyContent?: string;
  colAlignItems?: string;
  mobileProps?: {
    className?: string;
  };
};

const alignItemsMap: Record<string, string> = {
  normal: "items-normal",
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyContentMap: Record<string, string> = {
  normal: "justify-normal",
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
};

export function MobileRowColLayout({
  children,
  rowAlignItems,
  rowJustifyContent,
  colAlignItems,
  colJustifyContent,
  mobileProps,
}: MobileRowColLayoutProps) {
  return (
    <>
      <div
        className={cn(
          "flex w-full h-full max-sm:hidden sm:flex",
          rowAlignItems
            ? alignItemsMap[rowAlignItems] || "items-normal"
            : "items-normal",
          rowJustifyContent
            ? justifyContentMap[rowJustifyContent] || "justify-normal"
            : "justify-normal",
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex flex-col sm:hidden flex",
          colAlignItems
            ? alignItemsMap[colAlignItems] || "items-normal"
            : "items-normal",
          colJustifyContent
            ? justifyContentMap[colJustifyContent] || "justify-normal"
            : "justify-normal",
          mobileProps?.className,
        )}
      >
        {children}
      </div>
    </>
  );
}
