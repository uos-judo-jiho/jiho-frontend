import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { ReactComponent as PlusSvg } from "../../assets/svgs/plus.svg";
import Row from "../../layouts/Row";
import MENUID from "../../types/menuIdType";
import { ReactComponent as CloseSvg } from "../../assets/svgs/close.svg";

import SlideSubMenu from "./SlideSubMenu";

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
    <>
      <Container id="sidebar" ref={outside} className={isOpen ? "open" : ""}>
        <StyledClose onClick={toggleSide} />
        <NavWrapper>
          <MenuList>
            <MenuItem>
              <Link to={"/"}>
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
    </>
  );
}

export default SideBar;
