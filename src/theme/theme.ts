import { DefaultTheme } from "styled-components";

// Color
const blackColor: string = "#0f0c0c";
const yellowColor: string = "#ffb746";
const pinkColor: string = "#ff4667";
const whiteColor: string = "#f5f5fa";
const primaryColor: string = "#448aff";
const darkGreyColor: string = "#121212";
const greyColor: string = "#808080";
const lightGreyColor: string = "#eeeeee";

const darkHeaderColor: string = "#424242";

// Font
const titleFontSize: string = "3.6rem"; // 36px
const subTitleFontSize: string = "3rem"; // 30px
const descriptionFontSize: string = "1.8rem"; // 18px
const defaultFontSize: string = "1.6rem"; // 16px
const tinyFontSize: string = "1.2rem"; // 12px

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
};
