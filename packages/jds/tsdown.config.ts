import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    ui: "src/ui.ts",
    hook: "src/hook.ts",
    interactions: "src/interactions.ts",
    "interactions-motion": "src/interactions-motion.ts",
  },
  format: "esm",
  platform: "neutral",
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
