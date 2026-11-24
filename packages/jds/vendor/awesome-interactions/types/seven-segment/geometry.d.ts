/**
 * 7세그먼트 좌표 (digit 셀 W×H 기준).
 * 세그먼트 순서: a(상) b(우상) c(우하) d(하) e(좌하) f(좌상) g(중)
 */
export declare const DIGIT_W = 56;
export declare const DIGIT_H = 100;
export declare const COLON_W = 18;
export declare const SEGMENTS: string[];
/** 글자별 켜지는 세그먼트 (a~g) */
export declare const GLYPHS: Record<string, readonly number[]>;
