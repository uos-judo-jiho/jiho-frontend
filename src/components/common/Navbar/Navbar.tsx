import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import { MenuIcon } from "@/components/icons";

import SideBar from "@/components/common/SideBar/SideBar";
import Row from "@/components/layouts/Row";
import Logo from "@/components/Logo";

import { NavbarProvider, useNavbar } from "./NavBar.provider";
import { ClientOnly } from "@/components/ClientOnly";

const Header = styled.header`
  position: fixed;
  z-index: 1;
  top: 0;
  height: 60px;
`;
const Container = styled.div`
  height: 100%;
`;

const StyledMenu = styled(MenuIcon)<{ $isDark: boolean }>`
  filter: ${({ $isDark }) =>
    !$isDark
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

const NavMenu = ({ isDark }: { isDark: boolean }) => {
  const { setOpen } = useNavbar();

  return (
    <NavDropDown onClick={() => setOpen((prev) => !prev)}>
      <StyledMenu $isDark={isDark} title="Menu" />
    </NavDropDown>
  );
};

function Navbar({ isDark }: { isDark?: boolean }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Header>
      <NavbarProvider>
        <Container>
          <Row justifyContent="space-between">
            <NavMenu isDark={isDark || currentPath !== "/"} />
            <LogoWrapper>
              <Link to={"/"}>
                <Logo size={"48px"} isDark={isDark || currentPath !== "/"} />
              </Link>
            </LogoWrapper>
          </Row>
        </Container>
        <ClientOnly>
          <SideBar />
        </ClientOnly>
      </NavbarProvider>
    </Header>
  );
}

export default Navbar;
