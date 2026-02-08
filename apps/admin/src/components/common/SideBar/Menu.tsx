import { Link } from "react-router-dom";
import { MenuItem, MenuItemTitle, MenuList } from "./MenuStyledComponents";

const Menu = () => {
  return (
    <MenuList>
      <MenuItem>
        <Link to={"/"}>
          <MenuItemTitle>지호 페이지</MenuItemTitle>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={"/"}>
          <MenuItemTitle>어드민 페이지</MenuItemTitle>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={"/training"}>
          <MenuItemTitle>훈련 일지</MenuItemTitle>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={"/news"}>
          <MenuItemTitle>지호지</MenuItemTitle>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={"/notice"}>
          <MenuItemTitle>공지사항</MenuItemTitle>
        </Link>
      </MenuItem>
    </MenuList>
  );
};

export default Menu;
