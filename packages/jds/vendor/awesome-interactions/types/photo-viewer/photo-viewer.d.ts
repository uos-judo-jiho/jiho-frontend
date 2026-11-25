import { type ReactNode } from "react";
export interface PhotoViewerItem {
    id: string;
    /** 스크린 리더가 읽는 사진 이름 */
    label: string;
    /** 목록에 보이는 칸 */
    thumbnail: ReactNode;
    /** 크게 볼 때의 내용 — 틀을 꽉 채운다 */
    content: ReactNode;
    /** 가로 ÷ 세로. 없으면 칸 안의 <img> 나 불러온 사진에서 읽는다 */
    aspect?: number;
}
export interface PhotoViewerLabels {
    close: string;
    previous: string;
    next: string;
    /** position 은 1부터 */
    position: (position: number, total: number) => string;
}
interface PhotoViewerProps {
    items: readonly PhotoViewerItem[];
    /** 아직 다 받지 않았을 때의 전체 장수 (기본은 items 의 길이) */
    total?: number;
    /** 마지막 사진에 닿았는데 total 이 더 많을 때 — 나머지를 받아 items 를 늘린다 */
    onReachEnd?: () => void;
    /** 커지고 넘어가는 시간(s) */
    duration?: number;
    /** 이 거리(px)를 넘게 밀거나 빠르게 밀면 넘어간다 */
    threshold?: number;
    /** 크게 볼 때의 모서리(px) */
    radius?: number;
    /** true: 가장 가까운 position 이 있는 조상 안에서 / false: 화면 전체 */
    contained?: boolean;
    labels?: Partial<PhotoViewerLabels>;
    /** 목록(<ul>) */
    className?: string;
    triggerClassName?: string;
    backdropClassName?: string;
    /** 닫기 · 이전 · 다음 버튼 */
    controlClassName?: string;
    counterClassName?: string;
}
/**
 * 사진 묶음. 누른 칸이 그 자리에서 커지고, 닫지 않고 앞뒤 사진으로 넘긴다
 * (←/→ · Home/End · 버튼 · 좌우로 밀기). 닫으면 지금 보고 있는 사진의 칸으로 돌아간다.
 * 칸의 잘린 모양에서 시작해 원본 비율로 펼치므로(clip-path + 균일한 scale) 사진이 찌그러지지 않는다.
 */
export declare function PhotoViewer({ items, total, onReachEnd, duration, threshold, radius, contained, labels, className, triggerClassName, backdropClassName, controlClassName, counterClassName, }: PhotoViewerProps): import("react").JSX.Element;
export {};
