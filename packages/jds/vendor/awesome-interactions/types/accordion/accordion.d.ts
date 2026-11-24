import { type ReactNode } from "react";
export interface AccordionItem {
    id: string;
    title: ReactNode;
    content: ReactNode;
}
interface AccordionProps {
    items: readonly AccordionItem[];
    /** 여러 개를 동시에 열 수 있는지 */
    multiple?: boolean;
    /** 열고 닫는 시간(s) */
    duration?: number;
    className?: string;
    itemClassName?: string;
    triggerClassName?: string;
    panelClassName?: string;
}
/**
 * 레이아웃 애니메이션으로 열고 닫는 아코디언. height 를 직접 애니메이션하지 않는다 —
 * 상자 크기는 바로 바뀌고, 아래 항목들은 layout(transform)으로 미끄러지며, 내용은 페이드한다.
 */
export declare function Accordion({ items, multiple, duration, className, itemClassName, triggerClassName, panelClassName, }: AccordionProps): import("react").JSX.Element;
export {};
