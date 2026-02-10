import { MENU_ID, MenuIdType } from "@/shared/lib/types/MenuIdType";
import { Link, useLocation } from "react-router-dom";

import { useLatestNews } from "@/features/seo/news/hooks/use-latest-news";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { useNavbar } from "../Navbar/NavBar.provider";
import {
  MenuItem,
  MenuItemTitle,
  MenuList,
  MenuProps,
} from "./MenuStyledComponents";
import ToggleMenuItem from "./ToggleMenuItem";

const ClientMenu = ({ selected, setSelected }: MenuProps) => {
  const location = useLocation();
  const { open, setOpen } = useNavbar();

  const { lastestNewsYear } = useLatestNews();

  const handleClickMenu = (id: MenuIdType) => {
    switch (id) {
      case MENU_ID.newsToggleMenu:
        setSelected((prev) => [
          prev[0] === "selected" ? "animate" : "selected",
          prev[1] === "closed" ? "closed" : "animate",
        ]);
        break;
      case MENU_ID.trainingToggleMenu:
        setSelected((prev) => [
          prev[0] === "closed" ? "closed" : "animate",
          prev[1] === "selected" ? "animate" : "selected",
        ]);
        break;
      default:
        break;
    }
  };

  const handleClickLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (open && location.pathname === href) {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <MenuList>
      <MenuItem>
        <Link to={"/"} onClick={(e) => handleClickLink(e, "/")}>
          <MenuItemTitle>About 지호</MenuItemTitle>
        </Link>
      </MenuItem>
      <MenuItem>
        <ToggleMenuItem
          handleClickMenu={handleClickMenu}
          selected={selected[0]}
          parentTitle={"지호지"}
          targetMenu={MENU_ID.newsToggleMenu}
          subMenuItemList={vaildNewsYearList(lastestNewsYear)
            .reverse()
            .map((year) => ({
              href: `/news/${year}`,
              title: `${year} 지호지`,
            }))}
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
        <Link to={"/notice"} onClick={(e) => handleClickLink(e, "/notice")}>
          <MenuItemTitle>공지사항</MenuItemTitle>
        </Link>
      </MenuItem>
    </MenuList>
  );
};

export default ClientMenu;
