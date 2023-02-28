export const Constants = {
  AWS_BASE_URL: "https://uosjudo.com/",
} as const;

type T = typeof Constants;
type TConstants = keyof T;
type TConstantsValue = keyof T[keyof T];
