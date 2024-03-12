import React from "react";
import styled from "styled-components";
import Title from "../../../layouts/Title";

type FormContainerProps = {
  children: React.ReactNode;
  title: string;
};

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

function FormContainer({ children, title }: FormContainerProps) {
  return (
    <Container>
      <Title title={title} color="black" />
      {children}
    </Container>
  );
}

export default FormContainer;
