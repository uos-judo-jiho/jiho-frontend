export const Constants = {
  BASE_URL: "https://uosjudo.com/",
  LOGO_BLACK: require("../assets/images/logo/logo-removebg.png"),
  LOGO_WHIET: require("../assets/images/logo/logo-removebg-white.png"),
  BG_COLOR_808080: require("../assets/images/bg-color-808080.png"),
} as const;

type T = typeof Constants;
export type TConstants = keyof T;
export type TConstantsValue = keyof T[keyof T];
