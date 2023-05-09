import { Link } from "react-router-dom";
import MENUID from "../../types/menuIdType";

import {
  MenuItem,
  MenuItemTitle,
  MenuList,
  MenuProps,
} from "./MenuStyledComponents";
import ToggleMenuItem from "./ToggleMenuItem";

function ClientMenu({ selected, setSelected }: MenuProps) {
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
        <ToggleMenuItem
          handleClickMenu={handleClickMenu}
          selected={selected[0]}
          parentTitle={"지호지"}
          targetMenu={MENUID.newsToggleMenu}
          subMenuItemList={[{ href: "/news/2022", title: "2022 지호지" }]}
        />
      </MenuItem>
      <MenuItem>
        <ToggleMenuItem
          handleClickMenu={handleClickMenu}
          selected={selected[1]}
          parentTitle={"지호운동"}
          targetMenu={MENUID.trainingToggleMenu}
          subMenuItemList={[{ href: "/photo", title: "훈련일지" }]}
        />
      </MenuItem>
      <MenuItem>
        <Link to={"/notice"}>
          <MenuItemTitle>공지사항</MenuItemTitle>
        </Link>
      </MenuItem>
    </MenuList>
  );
}

export default ClientMenu;
