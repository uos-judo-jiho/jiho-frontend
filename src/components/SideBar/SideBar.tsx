import { SetStateAction, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { ReactComponent as CloseSvg } from "../../assets/svgs/close.svg";

import AdminMenu from "./AdminMenu";
import ClientMenu from "./ClientMenu";

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: Function;
};

const Container = styled.div`
  z-index: 999;
  padding: 50px;
  background-color: ${(props) => props.theme.bgColor};
  height: 100%;
  width: 25%;
  left: -55%;
  top: 0;
  position: fixed;
  transition: 0.5s;
  &.open {
    left: 0;
    transition: 0.5s;
  }
  @media (max-width: 539px) {
    width: 100%;
    left: -100%;
  }
`;
const NavWrapper = styled.nav``;

const StyledClose = styled(CloseSvg)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 20px;
  height: 20px;
  z-index: 1000;
  cursor: pointer;
`;

function SideBar({ isOpen, setIsOpen }: SideBarProps) {
  const outside = useRef<any>();

  const initSelected = [false, false];
  const [selected, setSelected] = useState(initSelected);
  const [isClient, setIsClient] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/admin")) {
      setIsClient(false);
    } else {
      setIsClient(true);
    }
  }, [location]);

  useEffect(() => {
    document.addEventListener("mousedown", handlerOutside);
    return () => {
      document.removeEventListener("mousedown", handlerOutside);
    };
  });

  function handlerOutside(e: any) {
    if (!outside.current.contains(e.target)) {
      toggleSide();
    }
  }

  function toggleSide() {
    setSelected(initSelected);
    setIsOpen(false);
  }

  return (
    <>
      <Container id="sidebar" ref={outside} className={isOpen ? "open" : ""}>
        <StyledClose onClick={toggleSide} />
        <NavWrapper>
          {isClient ? (
            <ClientMenu selected={selected} setSelected={setSelected} />
          ) : (
            <AdminMenu />
          )}
        </NavWrapper>
      </Container>
    </>
  );
}

export default SideBar;
