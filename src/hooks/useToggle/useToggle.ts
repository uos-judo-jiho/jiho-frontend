import { useReducer } from "react";

/**
 * @see https://github.com/toss/react-simplikit/blob/main/src/hooks/useToggle/useToggle.ts
 */
export function useToggle(initialValue: boolean = false) {
  return useReducer(toggle, initialValue);
}

const toggle = (state: boolean) => !state;
