import { Constants } from "../constant";
import { MergeTypes } from "../utils/Type";

// Color
const blackColor = Constants.BLACK_COLOR;
const yellowColor = Constants.YELLOW_COLOR;
const whiteColor = Constants.WHITE_COLOR;
const primaryColor = Constants.PRIMARY_COLOR;
const darkGreyColor = Constants.DARK_GREY_COLOR;
const greyColor = Constants.GREY_COLOR;
const lightGreyColor = Constants.LIGHT_GREY_COLOR;

// Font
const titleFontSize = Constants.TITLE_FONT_SIZE; // 36px
const subTitleFontSize = Constants.SUB_TITLE_FONT_SIZE; // 30px
const descriptionFontSize = Constants.DESCRIPTION_FONT_SIZE; // 18px
const defaultFontSize = Constants.DEFAULT_FONT_SIZE; // 16px
const tinyFontSize = Constants.TINY_FONT_SIZE; // 12px

// Line Height
const titleLineHeight = Constants.TITLE_LINE_HEIGHT; // 36px
const subTitleLineHeight = Constants.SUB_TITLE_LINE_HEIGHT; // 30px
const descriptionLineHeight = Constants.DESCRIPTION_LINE_HEIGHT; // 18px
const defaultLineHeight = Constants.DEFAULT_LINE_HEIGHT; // 16px
const tinyLineHeight = Constants.TINY_LINE_HEIGHT; // 12px

export const darkTheme = {
  primaryColor: darkGreyColor,
  bgColor: darkGreyColor,
  textColor: whiteColor,
  accentColor: yellowColor,
  greyColor: greyColor,
  lightGreyColor: lightGreyColor,
  blackColor: blackColor,
  titleFontSize: titleFontSize,
  subTitleFontSize: subTitleFontSize,
  descriptionFontSize: descriptionFontSize,
  defaultFontSize: defaultFontSize,
  tinyFontSize: tinyFontSize,
  titleLineHeight: titleLineHeight,
  subTitleLineHeight: subTitleLineHeight,
  descriptionLineHeight: descriptionLineHeight,
  defaultLineHeight: defaultLineHeight,
  tinyLineHeight: tinyLineHeight,
} as const;

export const lightTheme = {
  primaryColor: primaryColor,
  bgColor: whiteColor,
  textColor: darkGreyColor,
  accentColor: yellowColor,
  greyColor: greyColor,
  lightGreyColor: lightGreyColor,
  blackColor: blackColor,
  titleFontSize: titleFontSize,
  subTitleFontSize: subTitleFontSize,
  descriptionFontSize: descriptionFontSize,
  defaultFontSize: defaultFontSize,
  tinyFontSize: tinyFontSize,
  titleLineHeight: titleLineHeight,
  subTitleLineHeight: subTitleLineHeight,
  descriptionLineHeight: descriptionLineHeight,
  defaultLineHeight: defaultLineHeight,
  tinyLineHeight: tinyLineHeight,
} as const;

export type DefaultThemeType = MergeTypes<typeof lightTheme, typeof darkTheme>; // 수정된 부분
