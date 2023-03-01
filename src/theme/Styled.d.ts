import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    blackColor: string;
    greyColor: string;
    lightGreyColor: string;
    primaryColor: string;
    textColor: string;
    bgColor: string;
    accentColor: string;
    titleFontSize: string;
    subTitleFontSize: string;
    descriptionFontSize: string;
    defaultFontSize: string;
    tinyFontSize: string;
  }
}
