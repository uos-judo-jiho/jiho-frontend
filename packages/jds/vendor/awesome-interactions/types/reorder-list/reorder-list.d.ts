import { type ReactNode } from "react";
/** 스크린 리더가 읽는 문장 — 다른 언어로 바꿀 때 */
export interface ReorderMessages {
    /** 손잡이 이름 */
    handle: (label: string) => string;
    /** 옮긴 뒤 알림 (position 은 1부터) */
    moved: (label: string, position: number, total: number) => string;
}
interface ReorderListProps<T extends string> {
    items: readonly T[];
    onReorder: (items: T[]) => void;
    /** 항목 내용 */
    renderItem: (item: T) => ReactNode;
    /** 스크린 리더가 읽을 항목 이름 */
    itemLabel?: (item: T) => string;
    className?: string;
    itemClassName?: string;
    handleClassName?: string;
    messages?: Partial<ReorderMessages>;
}
/**
 * 손잡이를 드래그해 순서를 바꾸는 목록 (Motion Reorder).
 * 드래그만으로는 키보드 사용자가 쓸 수 없으므로, 손잡이에 포커스를 두고 ↑/↓ 로도 옮길 수 있고
 * 바뀐 위치를 스크린 리더에 알린다.
 */
export declare function ReorderList<T extends string>({ items, onReorder, renderItem, itemLabel, className, itemClassName, handleClassName, messages, }: ReorderListProps<T>): import("react").JSX.Element;
export {};
