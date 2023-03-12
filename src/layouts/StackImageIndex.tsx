import React from "react";
import styled from "styled-components";

const Stack = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const IndexWrapper = styled.div`
  width: 3.2rem;
  height: 1.8rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.2rem ${(props) => props.theme.blackColor};
  background-color: ${(props) => props.theme.lightGreyColor};
  opacity: 0.6;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextWrapper = styled.span`
  text-align: center;
  letter-spacing: 0.3rem;
`;

function StackImageIndex() {
  return (
    <Stack>
      <IndexWrapper>
        <TextWrapper>1/2</TextWrapper>
      </IndexWrapper>
    </Stack>
  );
}

export default StackImageIndex;
