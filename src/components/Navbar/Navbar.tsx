import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Row from "../../layouts/Row";

import { ReactComponent as Menu } from "../../assets/svgs/menu.svg";

import Logo from "../Logo";
import SideBar from "../SideBar/SideBar";

const Header = styled.header`
  position: fixed;
  z-index: 1;
  top: 0;
  height: 92px;
`;
const Container = styled.div`
  /* height: 10vh; */
`;

type StyledMenuProps = {
  currentpath: string;
};

const StyledMenu = styled(Menu)<StyledMenuProps>`
  filter: ${(props) =>
    props.currentpath === "/"
      ? `invert(100%) sepia(3%) saturate(607%) hue-rotate(209deg) brightness(116%) contrast(87%)` // #eee
      : ""};

  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;

const NavDropDown = styled.nav`
  margin: auto 0;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPath, setcurrentPath] = useState("");

  const location = useLocation();

  useEffect(() => {
    setcurrentPath(location.pathname);
  }, [location]);

  function handleClick() {
    setIsOpen((prev) => !prev);
  }

  return (
    <Header>
      <Container>
        <Row justifyContent="space-between">
          <NavDropDown onClick={handleClick}>
            <StyledMenu currentpath={currentPath} />
          </NavDropDown>
          <LogoWrapper>
            <Link to={"/"}>
              <Logo size={"10vmin"} isDark={currentPath === "/" ? false : true} />
            </Link>
          </LogoWrapper>
        </Row>
      </Container>
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
    </Header>
  );
}

export default Navbar;
