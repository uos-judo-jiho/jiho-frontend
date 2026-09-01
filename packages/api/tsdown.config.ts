import { defineConfig } from "tsdown";

/**
 * orval 산출물(src/_generated)은 gitignore 대상이므로 `pnpm orval` 이 선행돼야
 * 한다. package.json 의 exports 와 엔트리 키가 1:1 로 대응한다.
 */
export default defineConfig({
  entry: {
    index: "src/index.ts",
    model: "src/model.ts",
    "_generated/v2/api/index": "src/_generated/v2/api/index.ts",
    "_generated/v2/admin/index": "src/_generated/v2/admin/index.ts",
  },
  format: "esm",
  // 브라우저(SPA)와 SSR(node) 양쪽에서 쓰이므로 특정 플랫폼에 고정하지 않는다.
  platform: "neutral",
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // dependencies/peerDependencies 는 tsdown 이 자동으로 external 처리한다.
});
