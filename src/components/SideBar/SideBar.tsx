import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { ReactComponent as PlusSvg } from "../../assets/svgs/plus.svg";
import Row from "../../layouts/Row";
import MENUID from "../../types/menuIdType";

import SlideSubMenu from "./SlideSubMenu";

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: Function;
};

const Container = styled.div`
  z-index: 999;
  padding: 50px;
  border-radius: 15px 0 0 15px;
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
`;
const NavWrapper = styled.nav``;

const MenuList = styled.ul`
  font-size: ${(props) => props.theme.descriptionFontSize};
`;

const MenuToggle = styled.a``;

const MenuItemTitle = styled.span`
  line-height: 200%;
`;

const MenuItem = styled.li`
  margin: 0 8px;
`;

const StyledPlus = styled(PlusSvg)`
  cursor: pointer;
  margin-top: -2px;
`;

function SideBar({ isOpen, setIsOpen }: SideBarProps) {
  const outside = useRef<any>();

  const initSelected = [false, false];
  const [selected, setSelected] = useState(initSelected);

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
    setSelected(initSelected);
    setIsOpen(false);
  }

  function handleClickMenu(id: MENUID) {
    let current;
    switch (id) {
      case MENUID.newsToggleMenu:
        current = selected[0];
        setSelected([!current, false]);
        break;
      case MENUID.trainingToggleMenu:
        current = selected[1];
        setSelected([false, !current]);
        break;
      default:
        break;
    }
  }

  return (
    <Container id="sidebar" ref={outside} className={isOpen ? "open" : ""}>
      <NavWrapper>
        <MenuList>
          <MenuItem>
            <Link to={"/about"}>
              <MenuItemTitle>About 지호</MenuItemTitle>
            </Link>
          </MenuItem>
          <MenuItem>
            <MenuToggle
              href="#"
              onClick={() => handleClickMenu(MENUID.newsToggleMenu)}
            >
              <Row justifyContent="space-between" alignItems="center">
                <MenuItemTitle>지호지</MenuItemTitle>
                <StyledPlus />
              </Row>
            </MenuToggle>
            {/* TODO classify itemsInfo Object  */}
            {/* TODO routing 조절 */}
            <SlideSubMenu
              selected={selected[0]}
              menuId={MENUID.newsToggleMenu}
              itemsInfo={[{ href: "/news/2022", title: "2022 지호지" }]}
            />
          </MenuItem>
          <MenuItem>
            <MenuToggle
              href="#"
              onClick={() => handleClickMenu(MENUID.trainingToggleMenu)}
            >
              <Row justifyContent="space-between" alignItems="center">
                <MenuItemTitle>지호운동</MenuItemTitle>
                <StyledPlus />
              </Row>
            </MenuToggle>
            <SlideSubMenu
              selected={selected[1]}
              menuId={MENUID.newsToggleMenu}
              itemsInfo={[
                { href: "/photo", title: "훈련일지" },
                // { href: "/video", title: "영상" },
              ]}
            />
          </MenuItem>
          {/* <MenuItem>
            <Link to="/">
              <MenuItemTitle>Connect Us</MenuItemTitle>
            </Link>
          </MenuItem> */}
        </MenuList>
      </NavWrapper>
    </Container>
  );
}

export default SideBar;
