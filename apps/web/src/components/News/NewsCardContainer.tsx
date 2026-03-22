import { cn } from "@/shared/lib/utils";
import React from "react";

type NewsCardContainerProps = {
  children: React.ReactNode;
};

const NewsCardContainer = ({ children }: NewsCardContainerProps) => {
  return (
    <div className="w-full mb-10 px-2 md:px-0">
      <div className={cn("grid grid-cols-1 gap-4", "lg:grid-cols-2")}>
        {children}
      </div>
    </div>
  );
};

export default NewsCardContainer;
