import { type ReactNode } from "react";
interface CursorFollowerProps {
    children?: ReactNode;
    /** 따라다니는 원의 지름(px) */
    size?: number;
    /** 스프링 강도 — 클수록 커서에 빨리 붙는다 */
    stiffness?: number;
    className?: string;
    /** 원 스타일 (색, blend mode 등) */
    dotClassName?: string;
}
/** 영역 안에서 스프링으로 커서를 따라오는 원 */
export declare function CursorFollower({ children, size, stiffness, className, dotClassName, }: CursorFollowerProps): import("react").JSX.Element;
export {};
