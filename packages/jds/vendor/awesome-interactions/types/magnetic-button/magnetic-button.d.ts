import { m } from "motion/react";
import type { ComponentProps } from "react";
interface MagneticButtonProps extends ComponentProps<typeof m.button> {
    /** 커서를 따라가는 정도 (0 ~ 1) */
    strength?: number;
}
export declare function MagneticButton({ strength, style, ...props }: MagneticButtonProps): import("react").JSX.Element;
export {};
