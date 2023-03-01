export const Constants = {
  BASE_URL: "https://uosjudo.com/",
  LOGO_BLACK: require("../assets/images/logo/logo-removebg.png"),
} as const;

type T = typeof Constants;
type TConstants = keyof T;
type TConstantsValue = keyof T[keyof T];
