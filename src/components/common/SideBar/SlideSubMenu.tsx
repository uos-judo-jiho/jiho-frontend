import { Link, useLocation } from "react-router-dom";
import { MenuItemInfoType } from "@/lib/types/menuItemInfoType";
import { SelectedType } from "./MenuStyledComponents";
import { cn } from "@/lib/utils";

import { useNavbar } from "../Navbar/NavBar.provider";

type SlideSubMenuProps = {
  selected: SelectedType;
  menuId: string;
  itemsInfo: MenuItemInfoType[];
};

const SlideSubMenu = ({ selected, itemsInfo, menuId }: SlideSubMenuProps) => {
  const location = useLocation();
  const { open, setOpen } = useNavbar();

  return (
    <ul
      id={menuId}
      className={cn(
        "w-full overflow-hidden text-base",
        selected === "selected" && "block animate-slide-down",
        selected === "animate" && "animate-slide-up",
        selected === "closed" && "h-0 hidden",
      )}
      style={
        {
          "--item-count": itemsInfo.length,
        } as React.CSSProperties
      }
    >
      {itemsInfo.map((itemInfo) => (
        <li
          key={itemInfo.title}
          className={cn(
            "mx-1 leading-[200%] hover:text-gray-500",
            location.pathname === itemInfo.href && "underline font-bold",
          )}
        >
          <Link
            to={itemInfo.href}
            onClick={(e) => {
              if (open && location.pathname === itemInfo.href) {
                e.preventDefault();
              }
              setOpen(false);
            }}
          >
            {itemInfo.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SlideSubMenu;
