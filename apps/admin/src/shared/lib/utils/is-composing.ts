import type { KeyboardEvent } from "react";

/**
 * 한글처럼 글자를 조합하는 중에 눌린 키인지. 이때의 Enter 는 글자를 확정하는
 * 입력기의 키라서, 추가·선택으로 읽으면 덜 친 글자가 저장된다.
 *
 * Safari 는 확정하는 Enter 를 조합이 끝난 뒤에 보내 isComposing 이 false 이므로
 * keyCode 229 도 함께 본다.
 */
export const isComposing = (event: KeyboardEvent): boolean =>
  event.nativeEvent.isComposing || event.keyCode === 229;
