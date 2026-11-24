import { type ReactNode } from "react";
export type SwipeDirection = "left" | "right";
interface SwipeCardsProps<T> {
    /** 위에서부터의 카드 — 첫 항목이 맨 위 */
    cards: readonly T[];
    getKey: (card: T) => string;
    renderCard: (card: T) => ReactNode;
    /** 맨 위 카드를 던졌을 때 */
    onSwipe: (card: T, direction: SwipeDirection) => void;
    /**
     * 카드가 날아갈 방향. 드래그로 던지면 스스로 알지만, 버튼처럼 바깥에서 카드를 뺄 때는
     * 그 방향을 여기로 알려준다.
     */
    direction?: SwipeDirection;
    /** 이 거리(px)를 넘기거나 빠르게 던지면 날아간다 */
    threshold?: number;
    /** 끌 때 기울어지는 최대 각도(deg) */
    tilt?: number;
    className?: string;
    cardClassName?: string;
}
/**
 * 좌우로 던지는 카드 스택. 기준을 넘지 않으면 제자리로 돌아온다.
 * 드래그를 못 쓰는 사용자를 위해 같은 동작을 버튼으로도 제공해야 한다 (데모 참고).
 */
export declare function SwipeCards<T>({ cards, getKey, renderCard, onSwipe, threshold, tilt, direction, className, cardClassName, }: SwipeCardsProps<T>): import("react").JSX.Element;
export {};
