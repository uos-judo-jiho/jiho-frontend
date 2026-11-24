interface AnalogClockProps {
    /** true: 모든 바늘이 연속으로 흐른다 / false: 초침이 1초마다 스프링으로 '틱' */
    smooth?: boolean;
    secondHand?: boolean;
    /** 지름(px) */
    size?: number;
    /** 스크린 리더가 읽을 이름 */
    label?: string;
    className?: string;
}
export declare function AnalogClock({ smooth, secondHand, size, label, className, }: AnalogClockProps): import("react").JSX.Element;
export {};
