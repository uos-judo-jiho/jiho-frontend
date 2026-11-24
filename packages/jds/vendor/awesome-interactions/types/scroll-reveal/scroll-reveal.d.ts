import type { ReactNode } from "react";
interface ScrollRevealProps {
    children: ReactNode;
    /** 등장 시 이동 거리(px) */
    offset?: number;
    delay?: number;
    once?: boolean;
}
export declare function ScrollReveal({ children, offset, delay, once }: ScrollRevealProps): import("react").JSX.Element;
export {};
