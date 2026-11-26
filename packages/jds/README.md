# Uos Jiho Judo Design System (JDS)

apps/web 의 `shared/ui` 와 apps/admin 의 `components/ui` 를 여기로 옮겨 모으는
중이다. 지금 들어온 것은 `Border` · `Spacing` · `Calendar` · `DatePicker`.

- `pnpm -C packages/jds build` — tsdown 으로 `dist/` (ESM + `.d.ts`) 생성
- `pnpm -C packages/jds test` — vitest (날짜 계산은 순수 함수, 달력은 happy-dom)
- import 는 `@packages/jds` / `@packages/jds/ui` / `@packages/jds/hook`
- 기본 스타일은 `@packages/jds/style.css` — 앱의 Tailwind CSS 에서 `layer(components)` 로 가져와야
  `className` 으로 넘긴 유틸리티가 이긴다

## 색은 앱 토큰을 따른다

jds 안에는 색을 박아 두지 않는다. 각 컴포넌트가 `var(--jd-line, var(--border, #e5e5e5))`
처럼 **web 의 `--jd-*` → admin 의 shadcn 변수 → 기본값** 순으로 떨어지게 써서,
같은 컴포넌트를 두 앱에 넣어도 그 앱의 팔레트를 입는다.

## 달력 (`Calendar` · `DatePicker`)

native `type="date"` 는 브라우저마다 모양과 달력 UI 가 전혀 다르고 운영 화면의
다른 입력과 선·높이가 맞지 않아서 대체한다. **값의 모양은 native 와 같게** 두어
(`YYYY-MM-DD`, `withTime` 이면 `YYYY-MM-DDTHH:mm`) 바꿔 끼우는 비용을 없앴다 —
zod 스키마나 서버로 보내는 값은 그대로다.

```tsx
import { DatePicker } from "@packages/jds/ui";

<DatePicker value={value} onChange={setValue} min="2026-12-01" />
<DatePicker withTime value={value} onChange={setValue} />
```

- 달력만 따로 쓰려면 `Calendar` — 팝오버 없이 그리드만 그린다.
- 키보드: 방향키로 이동, `Home`/`End` 주의 양 끝, `PageUp`/`PageDown` 달
  (`Shift` 와 함께 누르면 해), `Enter`/`Space` 선택, `Esc` 닫기.
- **방향키로는 선택이 바뀌지 않는다** — 활성 칸만 움직이고 `Enter` 를 눌러야
  값이 바뀐다. 키보드로 달을 훑어보다 실수로 값이 바뀌는 일을 막는다.
- WAI-ARIA grid 패턴이라 활성 칸 하나만 탭 순서에 있다. 달력 전체가 탭 한 번으로
  들어오고 한 번으로 나간다.
- 한 판은 언제나 6주(42칸)다. 달마다 칸 수가 바뀌면 팝오버 높이가 들썩이고
  키보드 이동 중에 초점이 화면 밖으로 튄다.
- 날짜 계산은 `src/calendar/date.ts` 의 순수 함수들이 맡는다. `Date` 를 UTC 로
  파싱하지 않도록 연·월·일을 숫자로 들고 다닌다 — `new Date("2026-11-25")` 는
  UTC 자정이라 KST 에서 하루 전으로 보이는, 가장 흔한 날짜 버그를 피한다.

## 인터랙션 (`@packages/jds/interactions`)

움직이는 컴포넌트(모핑 모달, 커맨드 팔레트, 사진 넘기기 등)는 npm 의
[`@99mini/interactions`](https://www.npmjs.com/package/@99mini/interactions) 를 다시 내보낸다.
앱은 `@packages/jds/interactions` 로만 쓴다. 패키지를 감싸거나 바꿀 때 `src/interactions*.ts` 만 고치면 된다.

- 쓰는 법 — 루트를 한 번 감싸고, CSS 는 Tailwind 의 components 레이어로 가져온다.

  ```tsx
  import { MotionProvider } from "@packages/jds/interactions/motion";
  import { MorphModal } from "@packages/jds/interactions";
  ```

  ```css
  @import "tailwindcss";
  @import "@packages/jds/interactions/style.css" layer(components);
  ```

  모양은 `className` · `panelClassName` 등으로 준다. 패키지 CSS 는 레이어 안에 있어 Tailwind 유틸리티가 언제나 이긴다.
  (`layer(components)` 없이 가져오면 반대로 패키지 스타일이 이긴다)

- 갱신 — `pnpm update @99mini/interactions` (jds 의 dependencies). 고칠 것은 awesome-landing 에서 고치고 새 버전을 배포한다.
- `motion` 은 `@99mini/interactions` 의 peer 라 jds 가 함께 가진다.
