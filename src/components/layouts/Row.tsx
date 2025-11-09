import React from "react";
import { cn } from "@/lib/utils";

type RowProps = {
  children: React.ReactNode | React.ReactNode[];
  alignItems?: string;
  justifyContent?: string;
  gap?: number;
  mobile?: boolean;
  pc?: boolean;
  className?: string;
};

const Row = React.forwardRef<HTMLDivElement, RowProps>(
  (
    { children, alignItems, justifyContent, gap, mobile, pc, className },
    ref
  ) => {
    // Map CSS values to Tailwind classes
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

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full h-full",
          alignItems
            ? alignItemsMap[alignItems] || "items-normal"
            : "items-normal",
          justifyContent
            ? justifyContentMap[justifyContent] || "justify-normal"
            : "justify-normal",
          mobile && "sm:hidden flex",
          pc && "max-sm:hidden sm:flex",
          className
        )}
        style={gap !== undefined ? { gap: `${gap}px` } : undefined}
      >
        {children}
      </div>
    );
  }
);

Row.displayName = "Row";

export default Row;
