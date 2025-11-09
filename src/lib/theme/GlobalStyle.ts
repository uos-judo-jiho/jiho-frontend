import { createGlobalStyle, css } from "styled-components";
import "@/lib/assets/fonts/font.css";

export const MediaLayout = css`
  @media (min-width: 1200px) {
    width: 1080px;
  }
  @media (min-width: 860px) and (max-width: 1199px) {
    width: 800px;
  }
  @media (max-width: 859px) {
    width: 560px;
  }
  @media (max-width: 539px) {
    width: 340px;
  }
`;

export const GlobalStyle = createGlobalStyle``;
