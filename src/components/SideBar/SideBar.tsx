import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
type SideBarProps = {
  isOpen: boolean;
  setIsOpen: Function;
};

const Container = styled.div`
  z-index: 1;
  padding: 12px;
  border-radius: 15px 0 0 15px;
  background-color: ${(props) => props.theme.bgColor};
  height: 100%;
  width: 40%;
  right: -55%;
  top: 0;
  position: fixed;
  transition: 0.5s ease;
  &.open {
    right: 0;
    transition: 0.5s ease;
  }
`;
const NavWrapper = styled.nav``;
const MenuList = styled.ul``;
const MenuItem = styled.li`
  margin: 30px 8px;
`;

function SideBar({ isOpen, setIsOpen }: SideBarProps) {
  const outside = useRef<any>();

  useEffect(() => {
    document.addEventListener("mousedown", handlerOutsie);
    return () => {
      document.removeEventListener("mousedown", handlerOutsie);
    };
  });

  function handlerOutsie(e: any) {
    if (!outside.current.contains(e.target)) {
      toggleSide();
    }
  }

  function toggleSide() {
    setIsOpen(false);
  }

  return (
    <Container id="sidebar" ref={outside} className={isOpen ? "open" : ""}>
      <NavWrapper>
        <MenuList>
          <Link to={"/about"}>
            <MenuItem>About 지호</MenuItem>
          </Link>
          <Link to={"/news"}>
            <MenuItem>지호지</MenuItem>
          </Link>
          <MenuItem>
            <MenuList>
              지호운동
              <Link to={"/trainingLog"}>
                <MenuItem>훈련일지</MenuItem>
              </Link>
              <Link to={""}>
                <MenuItem>대회 & 교류전</MenuItem>
              </Link>
            </MenuList>
          </MenuItem>
        </MenuList>
      </NavWrapper>
    </Container>
  );
}

export default SideBar;
