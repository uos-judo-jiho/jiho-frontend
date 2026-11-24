import { type ReactNode } from "react";
interface MorphModalProps {
    /** 닫혀 있을 때 보이는 카드 내용 */
    preview: ReactNode;
    /** 열렸을 때 패널 내용 */
    children: ReactNode;
    /** 다이얼로그 이름 (스크린 리더) */
    label: string;
    /** 모핑 시간(s) */
    duration?: number;
    /** 스프링 탄성 0 ~ 1 */
    bounce?: number;
    /**
     * true: 가장 가까운 position 이 있는 조상 안에서 열린다 (데모·카드 그리드 안)
     * false: 화면 전체를 덮는다
     */
    contained?: boolean;
    className?: string;
    panelClassName?: string;
    /** 패널 뒤를 덮는 막 — 전체 화면이면 body 아래에 그려지므로 색은 이것으로 준다 */
    backdropClassName?: string;
    /** 닫기 버튼 글자 (스크린 리더도 이것을 읽는다) */
    closeLabel?: string;
    closeClassName?: string;
}
/** 카드가 그 자리에서 패널로 늘어나며 열리는 모달 (shared layout) */
export declare function MorphModal({ preview, children, label, duration, bounce, contained, className, panelClassName, backdropClassName, closeLabel, closeClassName, }: MorphModalProps): import("react").JSX.Element;
export {};
