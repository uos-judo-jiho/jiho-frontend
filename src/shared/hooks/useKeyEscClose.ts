import { useEffect } from "react";

const useKeyEscClose = (closeThing: () => void) => {
  useEffect(() => {
    const escKeyModalClose = (e: { keyCode: number }) => {
      if (e.keyCode === 27) {
        closeThing();
      }
    };
    window.addEventListener("keydown", escKeyModalClose);
    return () => window.removeEventListener("keydown", escKeyModalClose);
  }, [closeThing]);
};

export default useKeyEscClose;
