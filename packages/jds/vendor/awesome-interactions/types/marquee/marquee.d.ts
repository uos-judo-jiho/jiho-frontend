import type { ReactNode } from "react";
interface MarqueeProps {
    children: ReactNode;
    /** 한 바퀴 도는 시간(s) — 작을수록 빠르다 */
    duration?: number;
    /** 항목 간격 (CSS 길이) */
    gap?: string;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    className?: string;
}
/** 내용을 두 번 이어 붙여 끊김 없이 흐르는 띠 */
export declare function Marquee({ children, duration, gap, direction, pauseOnHover, className, }: MarqueeProps): import("react").JSX.Element;
export {};
