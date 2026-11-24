import { type RefObject } from "react";
interface ScrollHighlightProps {
    text: string;
    /**
     * 아직 지나가지 않은 단어의 불투명도. 흐린 단어도 읽혀야 하므로 0.5 이상을 권한다
     * (어두운 바탕의 큰 글자에서 WCAG 3:1 을 넘는다).
     */
    dim?: number;
    /** 페이지가 아닌 상자 안에서 스크롤할 때 그 상자 (position 이 static 이 아니어야 한다) */
    container?: RefObject<HTMLElement | null>;
    className?: string;
}
/** 문단이 화면을 지나가는 동안 단어가 하나씩 밝아진다 */
export declare function ScrollHighlight({ text, dim, container, className }: ScrollHighlightProps): import("react").JSX.Element;
export {};
