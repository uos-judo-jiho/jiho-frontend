interface SplitTextProps {
    text: string;
    /** 글자 간 지연(s) */
    stagger?: number;
    className?: string;
}
export declare function SplitText({ text, stagger, className }: SplitTextProps): import("react").JSX.Element;
export {};
