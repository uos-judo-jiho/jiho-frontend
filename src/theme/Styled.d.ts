import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    greyColor: string;
    primaryColor: string;
    textColor: string;
    bgColor: string;
    accentColor: string;
  }
}
