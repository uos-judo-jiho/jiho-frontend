import React, { useEffect } from "react";

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  onClick: (event: MouseEvent) => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onClick]);
};

export default useClickOutside;
