import { Link } from "react-router-dom";
import MENUID from "../../types/menuIdType";
import SlideSubMenu from "./SlideSubMenu";

import { useState } from "react";
import Row from "../../layouts/Row";
import {
  MenuItem,
  MenuItemTitle,
  MenuList,
  MenuToggle,
  StyledPlus,
} from "./MenuStyledComponents";

function ClientMenu() {
  const initSelected = [false, false];
  const [selected, setSelected] = useState(initSelected);
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
  );
}

export default ClientMenu;
