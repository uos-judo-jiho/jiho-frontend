import { MenuIdType } from "@/shared/lib/types/MenuIdType";
import {
  MenuItemTitle,
  MenuToggle,
  SelectedType,
} from "./MenuStyledComponents";
import SlideSubMenu from "./SlideSubMenu";

type ToggleMenuItemProps = {
  handleClickMenu(id: MenuIdType): void;
  selected: SelectedType;
  parentTitle: string;
  targetMenu: string;
  subMenuItemList: {
    href: string;
    title: string;
  }[];
};

const ToggleMenuItem = ({
  handleClickMenu,
  selected,
  parentTitle,
  subMenuItemList,
  targetMenu,
}: ToggleMenuItemProps) => {
  return (
    <>
      <MenuToggle onClick={() => handleClickMenu(targetMenu)} to={"#"}>
        <div className="flex w-full h-full justify-between items-center">
          <MenuItemTitle>{parentTitle}</MenuItemTitle>
          <span>{selected === "selected" ? "-" : "+"}</span>
        </div>
      </MenuToggle>
      <SlideSubMenu
        selected={selected}
        menuId={targetMenu}
        itemsInfo={subMenuItemList}
      />
    </>
  );
};

export default ToggleMenuItem;
