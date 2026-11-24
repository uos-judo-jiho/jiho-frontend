import type { CSSProperties } from "react";

export type SpacingProps = {
  /** Tailwind spacing 스케일 값 — `size={4}` 는 `h-4` / `w-4` 와 같은 1rem */
  size: number;
  /** 벌리는 방향. 기본은 세로(높이), `horizontal` 이면 가로(너비) */
  direction?: "horizontal" | "vertical";
  /** Tailwind 유틸리티로 덮어쓴다 — 세로는 `h-*`, 가로는 `w-*` */
  className?: string;
};

/**
 * 형제 요소 사이를 벌리는 빈 요소.
 *
 * `h-${size}` 처럼 조립한 클래스는 Tailwind 가 스캔하지 못해 CSS 가 생성되지
 * 않고, 인라인 스타일은 클래스를 이긴다. 그래서 크기만 CSS 변수로 넘기고
 * 나머지는 `style.css` 의 `.jds-spacing` 에 두어 `className` 이 덮어쓸 수 있게 한다.
 */
export const Spacing = ({
  size,
  direction = "vertical",
  className,
}: SpacingProps) => {
  return (
    <div
      aria-hidden
      data-direction={direction}
      className={className ? `jds-spacing ${className}` : "jds-spacing"}
      style={{ "--jds-spacing-size": size } as CSSProperties}
    />
  );
};
