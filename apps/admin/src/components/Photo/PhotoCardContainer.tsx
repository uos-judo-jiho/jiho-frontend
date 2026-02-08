import React from "react";

type PhotoCardContainerProps = {
  children: React.ReactNode;
};

const PhotoCardContainer = ({ children }: PhotoCardContainerProps) => {
  return (
    <div className="flex justify-center">
      <ul className="max-w-[800px] w-full grid grid-cols-3 gap-2 mb-1">
        {children}
      </ul>
    </div>
  );
};

export default PhotoCardContainer;
