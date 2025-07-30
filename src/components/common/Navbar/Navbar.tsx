import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

import Menu from "@/lib/assets/svgs/menu.svg";

import Row from "@/components/layouts/Row";
import Logo from "@/components/Logo";
import SideBar from "@/components/common/SideBar/SideBar";

import { NavbarProvider, useNavbar } from "./NavBar.provider";

const Header = styled.header`
  position: fixed;
  z-index: 1;
  top: 0;
  height: 60px;
`;
const Container = styled.div`
  height: 100%;
`;

type StyledMenuProps = {
  currentpath: string;
};

const StyledMenu = styled.img<StyledMenuProps>`
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

const NavMenu = ({ currentPath }: { currentPath: string }) => {
  const { setOpen } = useNavbar();

  return (
    <NavDropDown onClick={() => setOpen((prev) => !prev)}>
      <StyledMenu currentpath={currentPath} src={Menu} />
    </NavDropDown>
  );
};

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Header>
      <NavbarProvider>
        <Container>
          <Row justifyContent="space-between">
            <NavMenu currentPath={currentPath} />
            <LogoWrapper>
              <Link to={"/"}>
                <Logo size={"48px"} isDark={currentPath === "/" ? false : true} />
              </Link>
            </LogoWrapper>
          </Row>
        </Container>
        <SideBar />
      </NavbarProvider>
    </Header>
  );
}

export default Navbar;
