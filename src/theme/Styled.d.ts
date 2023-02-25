import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    lightGreyColor: string;
    primaryColor: string;
    textColor: string;
    bgColor: string;
    accentColor: string;
    titleFontSize: string;
    subTitleFontSize: string;
    descriptionFontSize: string;
    tinyFontSize: string;
  }
}
