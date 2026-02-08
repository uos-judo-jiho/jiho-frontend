import { CSSProperties } from "react";

export type MergeTypes<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
      ? T[K] | U[K] // Merge values for the same key
      : T[K]
    : K extends keyof U
      ? U[K]
      : never;
};

export type PickCSSProperty<T extends keyof CSSProperties> = Partial<{
  [K in T]: CSSProperties[K];
}>;
