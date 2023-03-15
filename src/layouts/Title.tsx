import styled from "styled-components";
import { Constants } from "../constant/constant";

type TitleProps = {
  title: string;
  color?: string;
  fontSize?: string;
};
type ContainerProps = {
  color?: string;
  fontSize?: string;
};

const Container = styled.h1<ContainerProps>`
  font-size: ${(props) => props.fontSize};
  color: ${(props) =>
    props.color === "white" ? props.theme.bgColor : props.theme.blackColor};
  word-break: keep-all;
`;

function Title({
  title,
  color = "white",
  fontSize = Constants.TITLE_FONT_SIZE,
}: TitleProps) {
  return (
    <Container color={color} fontSize={fontSize}>
      {title}
    </Container>
  );
}

export default Title;
