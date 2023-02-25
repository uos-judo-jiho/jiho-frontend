import { DefaultTheme } from "styled-components";

// Color
const yellowColor: string = "#ffb746";
const pinkColor: string = "#ff4667";
const whiteColor: string = "#ffffff";
const primaryColor: string = "#448aff";
const darkGreyColor: string = "#121212";
const greyColor: string = "#eeeeee";

const darkHeaderColor: string = "#424242";

// Font
const titleFontSize: string = "36px";
const subTitleFontSize: string = "30px";
const descriptionFontSize: string = "16px";
const tinyFontSize: string = "14px";

export const darkTheme: DefaultTheme = {
  primaryColor: darkGreyColor,
  bgColor: darkGreyColor,
  textColor: whiteColor,
  accentColor: yellowColor,
  greyColor: greyColor,
  titleFontSize: titleFontSize,
  subTitleFontSize: subTitleFontSize,
  descriptionFontSize: descriptionFontSize,
  tinyFontSize: tinyFontSize,
};

export const lightTheme: DefaultTheme = {
  primaryColor: primaryColor,
  bgColor: greyColor,
  textColor: darkGreyColor,
  accentColor: yellowColor,
  greyColor: greyColor,
  titleFontSize: titleFontSize,
  subTitleFontSize: subTitleFontSize,
  descriptionFontSize: descriptionFontSize,
  tinyFontSize: tinyFontSize,
};
