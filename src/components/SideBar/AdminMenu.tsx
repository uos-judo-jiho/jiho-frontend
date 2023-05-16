import { Link } from "react-router-dom";
import {
  MenuItem,
  MenuItemTitle,
  MenuList,
  MenuProps,
} from "./MenuStyledComponents";

function AdminMenu() {
  return (
    <MenuList>
      <MenuItem>
        <Link to={"/"}>
          <MenuItemTitle>지호 페이지</MenuItemTitle>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={"/admin"}>
          <MenuItemTitle>어드민 페이지</MenuItemTitle>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={"/admin/training"}>
          <MenuItemTitle>훈련 일지</MenuItemTitle>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={"/admin/news"}>
          <MenuItemTitle>지호지</MenuItemTitle>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={"/admin/notice"}>
          <MenuItemTitle>공지사항</MenuItemTitle>
        </Link>
      </MenuItem>
    </MenuList>
  );
}

export default AdminMenu;
