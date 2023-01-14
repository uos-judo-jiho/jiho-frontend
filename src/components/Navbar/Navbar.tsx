import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Row from "../../layouts/Row";
import { ReactComponent as Logo } from "../../assets/svgs/logo.svg";
import { ReactComponent as Menu } from "../../assets/svgs/menu.svg";

const Header = styled.header`
  margin: 0 auto;
`;
const Container = styled.div`
  min-height: 80px;
`;
const StyledLogo = styled(Logo)`
  width: 120px;
  height: 120px;
  margin: 10px 0 0 20px;
`;

const StyledMenu = styled(Menu)`
  margin-top: 20px;
  cursor: pointer;
`;
const NavDropDown = styled.nav``;

function Navbar() {
  const [clicked, setClicked] = useState<boolean>(false);
  function handleClick() {
    setClicked((prev) => !prev);
  }
  return (
    <Header>
      <Container>
        <Row justifyContent="space-between">
          <Link to={"/"}>
            <StyledLogo />
          </Link>
          <NavDropDown onClick={handleClick}>
            <StyledMenu />
          </NavDropDown>
        </Row>
      </Container>
    </Header>
  );
}

export default Navbar;
