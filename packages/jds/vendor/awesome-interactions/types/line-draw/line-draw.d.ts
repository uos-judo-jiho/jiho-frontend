interface LineDrawProps {
    /** 시리즈별 y 값 배열 (x 는 균등 간격) */
    series: readonly (readonly number[])[];
    /** 한 줄을 그리는 시간(s) */
    duration?: number;
    thickness?: number;
    width?: number;
    height?: number;
    className?: string;
    /** 시리즈 i 의 선 클래스 (색 지정) */
    lineClassName?: (index: number) => string | undefined;
    /** 스크린 리더가 읽을 이름 */
    label?: string;
}
/** 화면에 들어오면 선이 왼쪽부터 그려지는 차트 (Motion pathLength) */
export declare function LineDraw({ series, duration, thickness, width, height, label, className, lineClassName, }: LineDrawProps): import("react").JSX.Element;
export {};
