# Uos Jiho Judo Design System (JDS)

아직 비어 있는 스캐폴딩이다. `src/ui.ts` / `src/hook.ts` 배럴과 tsdown 빌드
설정만 잡혀 있고, 실제 컴포넌트·훅은 apps/web 의 `shared/ui` 와 apps/admin 의
`components/ui` 에서 옮겨오면서 채운다.

- `pnpm -C packages/jds build` — tsdown 으로 `dist/` (ESM + `.d.ts`) 생성
- import 는 `@packages/jds` / `@packages/jds/ui` / `@packages/jds/hook`
