import { type ReactNode } from "react";
export interface Toast {
    id: string | number;
    title: ReactNode;
    body?: ReactNode;
}
interface ToastStackProps {
    /** 들어온 순서대로 (마지막이 가장 새 알림) */
    toasts: Toast[];
    onDismiss: (id: Toast["id"]) => void;
    /** 저절로 사라지기까지(s). 0 이면 직접 닫을 때까지 남는다 */
    duration?: number;
    /** 한 번에 보이는 개수 — 더 오래된 것은 숨어 있다가 앞의 것이 사라지면 나온다 */
    limit?: number;
    /**
     * true: 새 알림이 맨 앞에 오고 오래된 것은 뒤로 작게 겹쳐 쌓인다 (iOS 알림처럼).
     *       포인터를 올리거나 포커스가 들어오면 목록으로 펼쳐진다.
     * false: 늘 목록으로 보인다.
     */
    collapse?: boolean;
    /** 알림 영역 이름 (스크린 리더) */
    label?: string;
    /** 닫기 버튼 이름 (스크린 리더) */
    dismissLabel?: string;
    className?: string;
    toastClassName?: string;
}
/**
 * 쌓이고 사라지는 알림. 겹친 더미 ↔ 펼친 목록 전환과, 들어오고 나갈 때 나머지가 자리를 옮기는 것은
 * 모두 layout 애니메이션(transform)이다.
 * 포인터나 포커스가 머무는 동안에는 펼쳐 두고 사라지는 시간도 멈춘다 (읽는 도중 사라지지 않게).
 */
export declare function ToastStack({ toasts, onDismiss, duration, limit, collapse, label, dismissLabel, className, toastClassName, }: ToastStackProps): import("react").JSX.Element;
export {};
