import Row from "../../layouts/Row";
import { MenuIdType } from "../../types/MenuIdType";
import { MenuItemTitle, MenuToggle, SelectedType } from "./MenuStyledComponents";
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

const ToggleMenuItem = ({ handleClickMenu, selected, parentTitle, subMenuItemList, targetMenu }: ToggleMenuItemProps) => {
  return (
    <>
      <MenuToggle onClick={() => handleClickMenu(targetMenu)}>
        <Row justifyContent="space-between" alignItems="center">
          <MenuItemTitle>{parentTitle}</MenuItemTitle>
          <span>{selected === "selected" ? "-" : "+"}</span>
        </Row>
      </MenuToggle>
      {/* TODO classify itemsInfo Object  */}
      {/* TODO routing 조절 */}
      <SlideSubMenu selected={selected} menuId={targetMenu} itemsInfo={subMenuItemList} />
    </>
  );
};

export default ToggleMenuItem;
