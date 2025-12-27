import LOGO_WHITE from "@/shared/lib/assets/images/logo/logo-removebg-white.webp";
import LOGO_BLACK from "@/shared/lib/assets/images/logo/logo-removebg.webp";

export const Constants = {
  // 클라이언트에서는 상대 경로 사용 (CORS 방지)
  BASE_URL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : typeof window !== "undefined"
        ? window.location.origin
        : "https://uosjudo.com",

  // 이미지
  LOGO_BLACK: LOGO_BLACK,
  LOGO_WHIET: LOGO_WHITE,

  BLACK_COLOR: "#0f0c0c",
  YELLOW_COLOR: "#ffb746",
  PINK_COLOR: "#ff4667",
  WHITE_COLOR: "#f8f8f8",
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

  /**
   * lastest news
   * TODO: 매년 수동 업데이트 필요
   */
  LATEST_NEWS_YEAR: "2025",
} as const;

type T = typeof Constants;
export type TConstants = keyof T;
export type TConstantsValue = keyof T[keyof T];
