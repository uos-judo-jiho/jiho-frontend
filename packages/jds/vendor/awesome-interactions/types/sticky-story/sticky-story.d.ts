import { type ReactNode, type RefObject } from "react";
interface StickyStoryProps {
    /** 차례로 읽히는 단계들 */
    steps: readonly ReactNode[];
    /** 지금 화면 가운데에 있는 단계 번호로 그리는 고정 영역 */
    renderVisual: (active: number) => ReactNode;
    /** 페이지가 아닌 상자 안에서 스크롤할 때 그 상자 (없으면 화면) */
    container?: RefObject<HTMLElement | null>;
    className?: string;
}
/**
 * 스크롤 스토리텔링 — 한쪽은 고정(sticky)되고, 다른 쪽 단계가 화면 가운데를 지날 때마다
 * 고정 영역이 그 단계로 바뀐다. 단계 높이는 `--story-step`, 고정 위치는 `--story-top` 으로 조절.
 */
export declare function StickyStory({ steps, renderVisual, container, className }: StickyStoryProps): import("react").JSX.Element;
export {};
