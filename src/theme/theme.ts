import { DefaultTheme } from "styled-components";

const yellowColor: string = "#ffb746";
const pinkColor: string = "#ff4667";
const whiteColor: string = "#ffffff";
const primaryColor: string = "#448aff";
const darkGreyColor: string = "#121212";
const greyColor: string = "#eeeeee";
const darkHeaderColor: string = "#424242";

export const darkTheme: DefaultTheme = {
  primaryColor: darkGreyColor,
  bgColor: darkGreyColor,
  textColor: whiteColor,
  accentColor: yellowColor,
  greyColor: greyColor,
};
export const lightTheme: DefaultTheme = {
  primaryColor: primaryColor,
  bgColor: whiteColor,
  textColor: darkGreyColor,
  accentColor: yellowColor,
  greyColor: greyColor,
};
