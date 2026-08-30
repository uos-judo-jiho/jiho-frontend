import BaseSvgComponent, { BaseSvgProps } from "./base-svg";

/**
 * 좋아요 하트. `filled` 로 채움/테두리를 바꾼다.
 *
 * 두 상태의 path 를 나눠 두면 전환할 때 아이콘 크기가 미세하게 흔들리므로,
 * 같은 도형을 fill/stroke 로만 다르게 그린다.
 */
export const HeartIcon: React.FC<BaseSvgProps & { filled?: boolean }> = ({
  filled = false,
  ...props
}) => (
  <BaseSvgComponent viewBox="0 0 24 24" size={20} fill="none" {...props}>
    <path
      d="M12 20.25c-.3 0-.59-.11-.82-.31l-7.1-6.36A5.4 5.4 0 0 1 2.25 9.5C2.25 6.6 4.6 4.25 7.5 4.25c1.7 0 3.3.8 4.32 2.16l.18.24.18-.24A5.4 5.4 0 0 1 16.5 4.25c2.9 0 5.25 2.35 5.25 5.25a5.4 5.4 0 0 1-1.83 4.08l-7.1 6.36c-.23.2-.52.31-.82.31Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinejoin="round"
    />
  </BaseSvgComponent>
);
