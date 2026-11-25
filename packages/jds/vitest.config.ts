import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    // 달력은 키보드 이동·초점이 핵심이라 DOM 이 필요하다. 날짜 계산
    // (date.spec.ts) 은 순수 함수라 환경과 무관하게 돈다.
    environment: "happy-dom",
  },
});
