import React from "react";
import { MenuItemTitle, MenuToggle } from "./MenuStyledComponents";
import Row from "../../layouts/Row";
import MENUID from "../../types/menuIdType";
import SlideSubMenu from "./SlideSubMenu";

type ToggleMenuItemProps = {
  handleClickMenu(id: MENUID): void;
  selected: boolean;
  parentTitle: string;
  targetMenu: string;
  subMenuItemList: {
    href: string;
    title: string;
  }[];
};
function ToggleMenuItem({
  handleClickMenu,
  selected,
  parentTitle,
  subMenuItemList,
  targetMenu,
}: ToggleMenuItemProps) {
  return (
    <>
      <MenuToggle onClick={() => handleClickMenu(targetMenu)}>
        <Row justifyContent="space-between" alignItems="center">
          <MenuItemTitle>{parentTitle}</MenuItemTitle>
          {selected ? <>-</> : <>+</>}
          {/* <StyledPlus /> */}
        </Row>
      </MenuToggle>
      {/* TODO classify itemsInfo Object  */}
      {/* TODO routing 조절 */}
      <SlideSubMenu
        selected={selected}
        menuId={targetMenu}
        itemsInfo={subMenuItemList}
      />
    </>
  );
}

export default ToggleMenuItem;
