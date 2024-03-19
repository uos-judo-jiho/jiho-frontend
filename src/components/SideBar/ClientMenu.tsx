import { Link } from "react-router-dom";
import { MENU_ID, menuIdType } from "../../types/menuIdType";

import {
  MenuItem,
  MenuItemTitle,
  MenuList,
  MenuProps,
} from "./MenuStyledComponents";
import ToggleMenuItem from "./ToggleMenuItem";

const ClientMenu = ({ selected, setSelected }: MenuProps) => {
  const handleClickMenu = (id: menuIdType) => {
    let current;
    switch (id) {
      case MENU_ID.newsToggleMenu:
        current = selected[0];
        setSelected([!current, false]);
        break;
      case MENU_ID.trainingToggleMenu:
        current = selected[1];
        setSelected([false, !current]);
        break;
      default:
        break;
    }
  };
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
          targetMenu={MENU_ID.newsToggleMenu}
          subMenuItemList={[
            { href: "/news/2022", title: "2022 지호지" },
            // { href: "/news/2023", title: "2023 지호지" },
            // { href: "/news/2024", title: "2024 지호지" },
          ]}
        />
      </MenuItem>
      <MenuItem>
        <ToggleMenuItem
          handleClickMenu={handleClickMenu}
          selected={selected[1]}
          parentTitle={"지호운동"}
          targetMenu={MENU_ID.trainingToggleMenu}
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
};

export default ClientMenu;
