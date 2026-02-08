import React from "react";

type SkeletonItemProps = {
  children?: React.ReactNode;
};

const SkeletonItem = ({ children }: SkeletonItemProps) => {
  return (
    <div className="relative w-full h-full bg-theme-light-grey overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
      {children}
    </div>
  );
};

export default SkeletonItem;
