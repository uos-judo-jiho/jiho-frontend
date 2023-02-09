import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { ReactComponent as PlusSvg } from "../../assets/svgs/plus.svg";
import Row from "../../layouts/Row";
import SlideSubMenu from "./SlideSubMenu";

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: Function;
};

const MENUID = {
  newsToggleMenu: "newsToggleMenu",
  trainingToggleMenu: "trainingToggleMenu",
};

type MENUID = typeof MENUID[keyof typeof MENUID];

const Container = styled.div`
  z-index: 1;
  padding: 50px;
  border-radius: 15px 0 0 15px;
  background-color: ${(props) => props.theme.bgColor};
  height: 100%;
  width: 25%;
  left: -55%;
  top: 0;
  position: fixed;
  transition: 0.5s ease;
  &.open {
    left: 0;
    transition: 0.5s ease;
  }
`;
const NavWrapper = styled.nav``;

const MenuList = styled.ul`
  font-size: ${(props) => props.theme.descriptionFontSize};
`;

const ToggleMenuList = styled.ul`
  display: none;
  font-size: ${(props) => props.theme.descriptionFontSize};

  &.selected {
    display: block;
  }
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

  const [selected, setSelected] = useState([false, false]);

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
            <Link to={"/about"}>About 지호</Link>
          </MenuItem>
          <MenuItem>
            <Row justifyContent="space-between" alignItems="center">
              지호지
              <StyledPlus onClick={() => handleClickMenu("newsToggleMenu")} />
            </Row>
            {/* TODO classify itemsInfo Object  */}
            <SlideSubMenu
              selected={selected[0]}
              menuId={"newsToggleMenu"}
              itemsInfo={[{ href: "/news", title: "2022 지호지" }]}
            />
          </MenuItem>
          <MenuItem>
            <Row justifyContent="space-between" alignItems="center">
              지호운동
              <StyledPlus
                onClick={() => handleClickMenu("trainingToggleMenu")}
              />
            </Row>
            <SlideSubMenu
              selected={selected[1]}
              menuId={"newsToggleMenu"}
              itemsInfo={[
                { href: "/trainingLog", title: "훈련일지" },
                { href: "/video", title: "영상" },
              ]}
            />
          </MenuItem>
        </MenuList>
      </NavWrapper>
    </Container>
  );
}

export default SideBar;
