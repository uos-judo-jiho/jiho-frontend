import type { ReactNode } from "react";
interface TiltCardProps {
    children: ReactNode;
    /** 최대 회전 각도(deg) */
    maxTilt?: number;
    className?: string;
}
export declare function TiltCard({ children, maxTilt, className }: TiltCardProps): import("react").JSX.Element;
export {};
