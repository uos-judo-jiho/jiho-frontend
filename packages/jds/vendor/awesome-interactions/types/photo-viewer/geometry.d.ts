/** 애니메이션하는 값 — transform · opacity · clip-path 만 */
export type Frame = {
    x: number;
    y: number;
    scale: number;
    opacity: number;
    clipPath: string;
};
export interface Box {
    left: number;
    top: number;
    width: number;
    height: number;
}
/** 사진 둘레의 여백(px) — photo-viewer.css.ts 의 틀 크기와 같은 값 */
export declare const PADDING: {
    readonly narrowBelow: 640;
    readonly narrow: {
        readonly x: 12;
        readonly y: 64;
    };
    readonly wide: {
        readonly x: 80;
        readonly y: 56;
    };
};
/** 비율을 지키며 영역 안에 꽉 차는 상자 (가운데) */
export declare function fit(area: Box, aspect: number): Box;
/** 다 커진 모양 */
export declare const openFrame: (radius: number) => Frame;
/**
 * frame 을 thumb 칸에 꼭 맞게 — 칸을 덮을 만큼(object-fit: cover) 줄이고 넘치는 부분은 자른다.
 * 칸이 없으면 제자리에서 살짝 작아지며 흐려진다.
 */
export declare function closedFrame(thumb: Box | null, frame: Box, radius: number): Frame;
