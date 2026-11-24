import { type ReactNode } from "react";
interface CompareSliderProps {
    /** 왼쪽(나누는 선 앞)에 보이는 것 */
    before: ReactNode;
    /** 오른쪽(나누는 선 뒤)에 보이는 것 */
    after: ReactNode;
    /** 손잡이 이름 (스크린 리더) */
    label?: string;
    /** 처음 위치 0 ~ 100 (%) — 마운트할 때 한 번 읽는다 */
    initial?: number;
    /** 화살표 키 한 번에 움직이는 양 (%) */
    step?: number;
    className?: string;
    handleClassName?: string;
}
/**
 * 두 화면을 겹쳐 놓고 나누는 선을 옮겨 비교한다.
 * 앞 화면은 clip-path 로 자르고 선은 transform 으로 옮긴다 (레이아웃을 다시 계산하지 않는다).
 * 드래그 대신 손잡이에서 화살표·Home·End 로도 옮긴다.
 */
export declare function CompareSlider({ before, after, label, initial, step, className, handleClassName, }: CompareSliderProps): import("react").JSX.Element;
export {};
