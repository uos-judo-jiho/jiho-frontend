export type MergeTypes<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
      ? T[K] | U[K] // Merge values for the same key
      : T[K]
    : K extends keyof U
    ? U[K]
    : never;
};
