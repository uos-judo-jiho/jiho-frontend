import type { CSSProperties } from "react";

export type BorderProps = {
  /** 선 두께(px) */
  size?: number;
  /** 선이 그어지는 방향. 기본은 가로선, `vertical` 이면 세로선 */
  direction?: "horizontal" | "vertical";
  /** Tailwind 유틸리티로 덮어쓴다 — 색은 `bg-*`, 두께·길이는 `h-*` / `w-*` */
  className?: string;
};

/**
 * 형제 요소 사이를 나누는 구분선.
 *
 * 기본 모양은 `style.css` 의 `.jds-border` 에 있다. 인라인 스타일은 클래스를
 * 이기므로, 여기서는 두께만 CSS 변수로 넘겨 `className` 이 덮어쓸 수 있게 한다.
 */
export const Border = ({
  size = 1,
  direction = "horizontal",
  className,
}: BorderProps) => {
  return (
    <hr
      aria-orientation={direction}
      className={className ? `jds-border ${className}` : "jds-border"}
      style={{ "--jds-border-size": `${size}px` } as CSSProperties}
    />
  );
};
