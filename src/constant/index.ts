import LOGO_BLACK from "../assets/images/logo/logo-removebg.png";
import LOGO_WHITE from "../assets/images/logo/logo-removebg-white.png";
import BG_COLOR_808080 from "../assets/images/bg-color-808080.png";

export const Constants = {
  /** NOTE: docker 환경에서 프론트 서버가 존재함으로 localhost:3000으로 설정 */
  BASE_URL: "http://localhost:3000",

  // 이미지
  LOGO_BLACK: LOGO_BLACK,
  LOGO_WHIET: LOGO_WHITE,
  BG_COLOR_808080: BG_COLOR_808080,

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
  /**
   * 32px
   */
  TITLE_FONT_SIZE: "2rem",
  /**
   * 24px
   */
  SUB_TITLE_FONT_SIZE: "1.5rem",
  /**
   * 18px
   */
  DESCRIPTION_FONT_SIZE: "1.125rem",
  /**
   * 16px
   */
  DEFAULT_FONT_SIZE: "1rem",
  /**
   * 12px
   */
  TINY_FONT_SIZE: "0.75rem",

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
