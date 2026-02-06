import React, { useEffect } from "react";

const useClickOutside = (
  ref: React.MutableRefObject<any>,
  onClick: (event: MouseEvent) => void,
) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClick(event);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
};

export default useClickOutside;
