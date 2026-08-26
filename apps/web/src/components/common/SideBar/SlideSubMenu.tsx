import { MenuItemInfoType } from "@/shared/lib/types/menuItemInfoType";
import { cn } from "@/shared/lib/utils";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { SelectedType } from "./MenuStyledComponents";

import { useNavbar } from "../Navbar/NavBar.provider";

type SlideSubMenuProps = {
  selected: SelectedType;
  menuId: string;
  itemsInfo: MenuItemInfoType[];
};

const SlideSubMenu = ({ selected, itemsInfo, menuId }: SlideSubMenuProps) => {
  const location = useLocation();
  const router = useRouter();
  const { open, setOpen } = useNavbar();

  return (
    <ul
      id={menuId}
      className={cn(
        "w-full overflow-hidden text-base",
        selected === "selected" && "block animate-slide-down",
        selected === "animate" && "animate-slide-up",
        selected === "closed" && "h-0 hidden"
      )}
      style={
        {
          "--item-count": itemsInfo.length,
        } as React.CSSProperties
      }
    >
      {itemsInfo.map((itemInfo) => {
        const itemPathname = router.buildLocation(itemInfo.link).pathname;
        const isCurrent = location.pathname === itemPathname;

        return (
          <li
            key={itemInfo.title}
            className={cn(
              "mx-1 leading-[200%] hover:text-gray-500",
              isCurrent && "underline font-bold"
            )}
          >
            <Link
              {...itemInfo.link}
              onClick={(e) => {
                if (open && isCurrent) {
                  e.preventDefault();
                }
                setOpen(false);
              }}
            >
              {itemInfo.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SlideSubMenu;
