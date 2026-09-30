import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

// jest-dom 7 이 싣고 오는 vitest 타입(`@testing-library/jest-dom/vitest`)은
// `Assertion<T>` 를 보강하는데, vitest 5 의 Assertion 은 `<R, T>` 라 선언이
// 합쳐지지 않는다 (skipLibCheck 에 가려져 조용히 matcher 타입만 빠진다).
// vitest 5 가 권장하는 대로 Matchers 를 직접 보강한다.
declare module "vitest" {
  interface Matchers<R, T> extends TestingLibraryMatchers<T, R> {}
}
