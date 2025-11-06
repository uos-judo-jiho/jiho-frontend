import styled, { css } from "styled-components";
import { Constants } from "@/lib/constant";

type TitleProps = {
  title: string;
  color?: string;
  fontSize?: string;
  heading?: 1 | 2 | 3;
};
type ContainerProps = {
  color?: string;
  fontSize?: string;
};

const HeadingCss = css<ContainerProps>`
  font-size: ${(props) => props.fontSize};
  color: ${(props) =>
    props.color === "white" ? props.theme.bgColor : props.theme.blackColor};
  word-break: keep-all;
  margin-bottom: 20px;
`;

const ContainerH1 = styled.h1<ContainerProps>`
  ${HeadingCss}
`;

const ContainerH2 = styled.h2<ContainerProps>`
  ${HeadingCss}
`;

const ContainerH3 = styled.h3<ContainerProps>`
  ${HeadingCss}
`;

const Container = ({
  as,
  ...props
}: ContainerProps & { children?: React.ReactNode; as: "h1" | "h2" | "h3" }) => {
  switch (as) {
    case "h1":
      return <ContainerH1 {...props} />;
    case "h2":
      return <ContainerH2 {...props} />;
    case "h3":
      return <ContainerH3 {...props} />;
    default:
      return <ContainerH1 {...props} />;
  }
};

function Title({
  title,
  color = "white",
  fontSize = Constants.TITLE_FONT_SIZE,
  heading = 1,
}: TitleProps) {
  return (
    <Container color={color} fontSize={fontSize} as={`h${heading}`}>
      {title}
    </Container>
  );
}

export default Title;
