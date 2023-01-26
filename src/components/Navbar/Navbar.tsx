import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Row from "../../layouts/Row";

import { ReactComponent as Menu } from "../../assets/svgs/menu.svg";
import { ReactComponent as Close } from "../../assets/svgs/close.svg";

import SideBar from "../SideBar/SideBar";
import Logo from "../Logo";

const Header = styled.header`
  margin: 0 auto;
`;
const Container = styled.div`
  min-height: 80px;
`;

const StyledMenu = styled(Menu)`
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;
const StyledClose = styled(Close)`
  margin-top: 20px;

  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;
const NavDropDown = styled.nav``;

function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleClick() {
    setIsOpen((prev) => !prev);
  }

  return (
    <Header>
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Container>
        <Row justifyContent="space-between">
          <NavDropDown onClick={handleClick}>
            <StyledMenu />
          </NavDropDown>
          <Link to={"/"}>
            <Logo />
          </Link>
        </Row>
      </Container>
    </Header>
  );
}

export default Navbar;
