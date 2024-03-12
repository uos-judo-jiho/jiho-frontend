import { DefaultTheme } from "styled-components";
import { Constants } from "../constant/constant";

// Color
const blackColor: string = Constants.BLACK_COLOR;
const yellowColor: string = Constants.YELLOW_COLOR;
const pinkColor: string = Constants.PINK_COLOR;
const whiteColor: string = Constants.WHITE_COLOR;
const primaryColor: string = Constants.PRIMARY_COLOR;
const darkGreyColor: string = Constants.DARK_GREY_COLOR;
const greyColor: string = Constants.GREY_COLOR;
const lightGreyColor: string = Constants.LIGHT_GREY_COLOR;

const darkHeaderColor: string = Constants.DARK_HEADER_COLOR;

// Font
const titleFontSize: string = Constants.TITLE_FONT_SIZE; // 36px
const subTitleFontSize: string = Constants.SUB_TITLE_FONT_SIZE; // 30px
const descriptionFontSize: string = Constants.DESCRIPTION_FONT_SIZE; // 18px
const defaultFontSize: string = Constants.DEFAULT_FONT_SIZE; // 16px
const tinyFontSize: string = Constants.TINY_FONT_SIZE; // 12px

// Line Height
const titleLineHeight: string = Constants.TITLE_LINE_HEIGHT; // 36px
const subTitleLineHeight: string = Constants.SUB_TITLE_LINE_HEIGHT; // 30px
const descriptionLineHeight: string = Constants.DESCRIPTION_LINE_HEIGHT; // 18px
const defaultLineHeight: string = Constants.DEFAULT_LINE_HEIGHT; // 16px
const tinyLineHeight: string = Constants.TINY_LINE_HEIGHT; // 12px

export const darkTheme: DefaultTheme = {
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
};

export const lightTheme: DefaultTheme = {
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
};
