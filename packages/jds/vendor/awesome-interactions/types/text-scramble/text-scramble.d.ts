interface TextScrambleProps {
    text: string;
    /** 전체 글자가 풀리는 데 걸리는 시간(s) */
    duration?: number;
    className?: string;
}
/** 무작위 글리프가 왼쪽부터 원래 글자로 풀려나가는 텍스트 */
export declare function TextScramble({ text, duration, className }: TextScrambleProps): import("react").JSX.Element;
export {};
