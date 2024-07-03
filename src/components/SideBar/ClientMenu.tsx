import { Link } from "react-router-dom";
import { MENU_ID, menuIdType } from "../../types/menuIdType";

import { vaildNewsYearList } from "../../utils/Utils";
import { MenuItem, MenuItemTitle, MenuList, MenuProps } from "./MenuStyledComponents";
import ToggleMenuItem from "./ToggleMenuItem";

const ClientMenu = ({ selected, setSelected }: MenuProps) => {
  const handleClickMenu = (id: menuIdType) => {
    switch (id) {
      case MENU_ID.newsToggleMenu:
        setSelected((prev) => [prev[0] === "selected" ? "animate" : "selected", prev[1] === "closed" ? "closed" : "animate"]);
        break;
      case MENU_ID.trainingToggleMenu:
        setSelected((prev) => [prev[0] === "closed" ? "closed" : "animate", prev[1] === "selected" ? "animate" : "selected"]);
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
          subMenuItemList={vaildNewsYearList().map((year) => ({ href: `/news/${year}`, title: `${year} 지호지` }))}
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
