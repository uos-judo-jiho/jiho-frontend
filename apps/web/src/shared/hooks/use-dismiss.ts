import { useEffect, type RefObject } from "react";

/**
 * Esc 키와 바깥 클릭(포인터다운)으로 오버레이를 닫는다.
 *
 * 이전 useClickOutside/useKeyEscClose 는 (1) 의존성 배열이 없어 매 렌더마다
 * 리스너를 재등록했고 (2) keyCode 같은 폐기된 API 를 썼으며 (3) 닫혀 있을
 * 때도 리스너가 붙어 있었다. 여기서는 열려 있을 때만 붙인다.
 */
export const useDismiss = (
  active: boolean,
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
) => {
  useEffect(() => {
    if (!active || typeof document === "undefined") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    const onPointerDown = (event: PointerEvent) => {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) onDismiss();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [active, ref, onDismiss]);
};
