import React from "react";
import styled from "styled-components";
type NoticeDescriptionProps = {
  description: string;
};

const Container = styled.div`
  font-size: ${(props) => props.theme.defaultFontSize};
`;
function NoticeDescription({ description }: NoticeDescriptionProps) {
  return (
    <Container>
      {description.split("\n").map((line, index) => {
        return (
          <>
            {line}
            <br key={line + index.toString()} />
          </>
        );
      })}
    </Container>
  );
}

export default NoticeDescription;
