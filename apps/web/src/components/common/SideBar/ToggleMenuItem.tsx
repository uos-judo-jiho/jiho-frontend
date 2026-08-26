import Row from "@/components/layouts/Row";
import { MenuIdType } from "@/shared/lib/types/MenuIdType";
import { MenuItemInfoType } from "@/shared/lib/types/menuItemInfoType";
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
  subMenuItemList: MenuItemInfoType[];
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
      <MenuToggle onClick={() => handleClickMenu(targetMenu)}>
        <Row justifyContent="space-between" alignItems="center">
          <MenuItemTitle>{parentTitle}</MenuItemTitle>
          <span>{selected === "selected" ? "-" : "+"}</span>
        </Row>
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
