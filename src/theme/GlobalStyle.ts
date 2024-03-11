import { createGlobalStyle, css } from "styled-components";

export const MediaLayout = css`
  @media (min-width: 1200px) {
    width: 1080px;
  }
  @media (min-width: 860px) and (max-width: 1199px) {
    width: 800px;
  }
  @media (max-width: 859px) {
    width: 540px;
  }
  @media (max-width: 539px) {
    width: 340px;
  }
`;

export const GlobalStyle = createGlobalStyle`  

html{
    font-size: 62.5%;
  @media (max-width: 859px) {
    font-size: 50%;
  }
}
    
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  /* font-size: 100%; */
  /* font: inherit; */
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
  overflow-x:hidden;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
*{
  box-sizing: border-box;
  padding:0;
  margin:0;

}
a{
  text-decoration: none;
  color:inherit;
}



header,footer{
  width: 100%;
  padding: 0 1.6rem;
}

button,a{
    background-color:transparent;
    border:none;
    &:hover{
        cursor: pointer; 
    }
}
`;
