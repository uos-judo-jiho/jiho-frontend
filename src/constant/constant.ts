export const Constants = {
  // base url
  BASE_URL: process.env.NODE_ENV === "production" && window.location.hostname !== "localhost" ? "https://uosjudo.com" : "http://localhost:3000",

  // 이미지
  LOGO_BLACK: require("../assets/images/logo/logo-removebg.png"),
  LOGO_WHIET: require("../assets/images/logo/logo-removebg-white.png"),
  BG_COLOR_808080: require("../assets/images/bg-color-808080.png"),

  BLACK_COLOR: "#0f0c0c",
  YELLOW_COLOR: "#ffb746",
  PINK_COLOR: "#ff4667",
  WHITE_COLOR: "#f5f5fa",
  PRIMARY_COLOR: "#448aff",
  DARK_GREY_COLOR: "#121212",
  GREY_COLOR: "#808080",
  LIGHT_GREY_COLOR: "#eeeeee",

  DARK_HEADER_COLOR: "#424242",

  // Font
  TITLE_FONT_SIZE: "3.6rem",
  SUB_TITLE_FONT_SIZE: "3rem",
  DESCRIPTION_FONT_SIZE: "1.8rem",
  DEFAULT_FONT_SIZE: "1.6rem",
  TINY_FONT_SIZE: "1.2rem",

  // Line Height
  TITLE_LINE_HEIGHT: "50px",
  SUB_TITLE_LINE_HEIGHT: "45px",
  DESCRIPTION_LINE_HEIGHT: "28px",
  DEFAULT_LINE_HEIGHT: "24px",
  TINY_LINE_HEIGHT: "18px",

  // lastest news
  LATEST_NEWS_YEAR: "2024",
} as const;

type T = typeof Constants;
export type TConstants = keyof T;
export type TConstantsValue = keyof T[keyof T];
