import { type ReactNode, type RefObject } from "react";
interface ParallaxProps {
    children: ReactNode;
    /** 스크롤 대비 움직이는 비율. 0 이면 고정, 1 이면 distance 만큼, 음수면 반대로 */
    speed?: number;
    /** 화면을 가로지르는 동안 움직이는 최대 거리(px) */
    distance?: number;
    /** 페이지가 아닌 상자 안에서 스크롤할 때 그 상자 (position 이 static 이 아니어야 한다) */
    container?: RefObject<HTMLElement | null>;
    className?: string;
}
/**
 * 스크롤에 따라 다른 속도로 움직이는 층. 요소가 화면에 들어올 때부터 나갈 때까지의
 * 진행도(0 → 1)를 +distance·speed → -distance·speed 이동으로 바꾼다. transform 만 쓴다.
 */
export declare function Parallax({ children, speed, distance, container, className, }: ParallaxProps): import("react").JSX.Element;
export {};
