import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * 디자인 토큰으로 만든 글자 크기 유틸 (`app/index.css` 의 `@theme --text-*`).
 *
 * tailwind-merge 에 알려 주지 않으면 `text-caption` 같은 커스텀 이름을 글자
 * 크기로 알아보지 못하고, `text-ink-muted` 같은 **색**과 같은 그룹으로 묶어
 * 둘 중 하나를 버린다. 그래서 `cn("text-caption", "text-ink-muted")` 가
 * `text-ink-muted` 만 남기고 크기를 조용히 떨어뜨렸다.
 *
 * `app/index.css` 에 `--text-*` 를 새로 추가하면 **이 배열에도 넣어야 한다** —
 * 빠뜨리면 그 토큰만 다시 조용히 사라진다.
 */
const TYPE_SCALE = [
  "display",
  "title",
  "heading",
  "subheading",
  "lead",
  "body",
  "caption",
  "micro",
] as const;

/**
 * 색은 따로 등록하지 않는다. 크기 목록만 알려 주면 거기에 없는 `text-*` 는
 * 색으로 떨어지므로, 유지해야 하는 목록이 하나로 줄어든다.
 */
const twMerge = extendTailwindMerge({
  extend: { theme: { text: [...TYPE_SCALE] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
