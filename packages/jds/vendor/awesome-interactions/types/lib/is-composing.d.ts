/**
 * 한글·일본어처럼 글자를 조합하는 중의 키인지. 이때의 Enter·Esc·방향키는 입력기의 것이다
 * (글자 확정, 조합 취소, 후보 고르기). Safari 는 확정하는 Enter 를 조합이 끝난 뒤에 보내
 * isComposing 이 false 이므로 keyCode 229 도 본다.
 */
export declare const isComposing: (event: {
    isComposing: boolean;
    keyCode: number;
}) => boolean;
