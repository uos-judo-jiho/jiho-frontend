import React from "react";
import styled from "styled-components";
type NoticeDescriptionProps = {
  description: string;
};

const Container = styled.div`
  font-size: ${(props) => props.theme.defaultFontSize};
`;
function NoticeDescription({ description }: NoticeDescriptionProps) {
  return <Container>{description}</Container>;
}

export default NoticeDescription;
