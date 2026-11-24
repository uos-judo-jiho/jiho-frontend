interface CountUpProps {
    to: number;
    from?: number;
    /** 애니메이션 시간(s) */
    duration?: number;
    /** Intl.NumberFormat 옵션 (소수점, 통화 등) */
    format?: Intl.NumberFormatOptions;
    locale?: string;
    className?: string;
}
/** 화면에 들어오면 숫자가 목표값까지 올라간다 */
export declare function CountUp({ to, from, duration, format, locale, className }: CountUpProps): import("react").JSX.Element;
export {};
