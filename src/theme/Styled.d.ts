import "styled-components";
import { DefaultThemeType } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme extends DefaultThemeType {}
}
