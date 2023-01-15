import React from "react";
import styled from "styled-components";
import NewsCard from "./NewsCard";

const Title = styled.h3``;

function NewsRowContainer() {
  return (
    <div>
      <Title>회장단</Title>
      <NewsCard />
    </div>
  );
}

export default NewsRowContainer;
