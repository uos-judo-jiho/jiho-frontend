import React, { useState } from "react";
import styled from "styled-components";

const Header = styled.header``;
function Navbar() {
  const [clicked, setClicked] = useState<boolean>(false);
  function handleClick() {
    setClicked((prev) => !prev);
  }
  return <Header>Navbar</Header>;
}

export default Navbar;
