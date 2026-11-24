interface NumberTickerProps {
    value: number;
    /** 자릿수가 굴러가는 시간(s) */
    duration?: number;
    /** 오른쪽 자리부터 늦게 출발하는 간격(s) — 0 이면 한꺼번에 */
    stagger?: number;
    /** Intl.NumberFormat 옵션 (천 단위 구분 등) */
    format?: Intl.NumberFormatOptions;
    locale?: string;
    className?: string;
}
/**
 * 자릿수마다 0~9 를 세로로 쌓은 기둥을 굴려 숫자를 바꾼다.
 * - 처음에는 화면에 들어올 때 0 에서부터 굴러간다.
 * - 나중에 생긴 자리는 0 을 거치지 않고 제 숫자로 작게 나타나 커지고, 기존 자리는 layout 으로 옆으로 비켜난다.
 * 스크린 리더는 숨긴 텍스트로 숫자 전체를 한 번에 읽고, 굴러가는 기둥은 aria-hidden.
 */
export declare function NumberTicker({ value, duration, stagger, format, locale, className, }: NumberTickerProps): import("react").JSX.Element;
export {};
