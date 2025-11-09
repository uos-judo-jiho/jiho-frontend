import React from "react";

type SkeletonItemProps = {
  children?: React.ReactNode;
};

const SkeletonItem = ({ children }: SkeletonItemProps) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-theme-light-grey before:content-[''] before:absolute before:top-0 before:left-0 before:w-1/2 before:h-full before:bg-gradient-to-r before:from-[#f2f2f2] before:via-[#ddd] before:to-[#f2f2f2] before:animate-loading-shimmer">
      {children}
    </div>
  );
};

export default SkeletonItem;
