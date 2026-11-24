interface SevenSegmentProps {
    /** 표시할 문자열 — 0-9, '-', ' ', ':' */
    value: string;
    /** 꺼진 세그먼트를 희미하게 남긴다 (LCD 잔상) */
    ghost?: boolean;
    /** 기울기(deg) — 실제 LCD 처럼 살짝 눕힌다 */
    skew?: number;
    /** 글자 높이(px) */
    height?: number;
    className?: string;
}
export declare function SevenSegment({ value, ghost, skew, height, className, }: SevenSegmentProps): import("react").JSX.Element;
export {};
