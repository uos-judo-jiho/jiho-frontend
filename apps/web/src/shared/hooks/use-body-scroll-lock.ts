import { useEffect } from "react";

/**
 * 드로어·모달이 열려 있는 동안 배경 스크롤을 잠근다.
 * 여러 오버레이가 동시에 열려도 마지막 하나가 닫힐 때까지 유지되도록
 * 잠금 횟수를 센다.
 */
let lockCount = 0;

export const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    lockCount += 1;
    document.body.dataset.scrollLocked = "true";

    return () => {
      lockCount -= 1;
      if (lockCount <= 0) {
        lockCount = 0;
        delete document.body.dataset.scrollLocked;
      }
    };
  }, [locked]);
};
