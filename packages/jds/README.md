# Uos Jiho Judo Design System (JDS)

아직 비어 있는 스캐폴딩이다. `src/ui.ts` / `src/hook.ts` 배럴과 tsdown 빌드
설정만 잡혀 있고, 실제 컴포넌트·훅은 apps/web 의 `shared/ui` 와 apps/admin 의
`components/ui` 에서 옮겨오면서 채운다.

- `pnpm -C packages/jds build` — tsdown 으로 `dist/` (ESM + `.d.ts`) 생성
- import 는 `@packages/jds` / `@packages/jds/ui` / `@packages/jds/hook`
- 기본 스타일은 `@packages/jds/style.css` — 앱의 Tailwind CSS 에서 `layer(components)` 로 가져와야
  `className` 으로 넘긴 유틸리티가 이긴다

## 인터랙션 (`@packages/jds/interactions`)

움직이는 컴포넌트(모핑 모달, 커맨드 팔레트, 숫자 굴리기 등)는 별도 저장소(awesome-landing)의
`@awesome/interactions` 를 **빌드한 결과를 그대로 복사해** 쓴다 — `vendor/awesome-interactions/`.
npm 공개 배포 전까지의 방식이며, 배포되면 exports 세 줄만 그 패키지로 바꾸면 된다 (앱의 import 는 그대로).

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

- 손대지 않는다 — 빌드 결과물이라 lint·format 대상에서 빠져 있다. 고칠 것은 awesome-landing 에서 고치고 다시 복사한다.
- 갱신 — awesome-landing 에서 `pnpm vendor:interactions <이 저장소>/packages/jds/vendor/awesome-interactions`.
  어느 커밋에서 만들었는지는 `VENDOR.json` 에 남는다.
- 런타임 의존성: `motion`, `@vanilla-extract/dynamic` (jds 의 dependencies).
