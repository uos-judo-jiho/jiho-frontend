import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

type SlideSubMenuProps = {
  selected: boolean;

  menuId: string;
  itemsInfo: {
    href: string;
    title: string;
  }[];
};

const ToggleMenuList = styled.ul`
  display: none;
  font-size: ${(props) => props.theme.descriptionFontSize};

  &.selected {
    display: block;
  }
`;

const MenuItem = styled.li`
  margin: 0 8px;
`;

function SlideSubMenu({ selected, itemsInfo, menuId }: SlideSubMenuProps) {
  return (
    <ToggleMenuList id={menuId} className={selected ? "selected" : ""}>
      {itemsInfo.map((itemInfo) => {
        return (
          <MenuItem>
            <Link to={itemInfo.href}>{itemInfo.title}</Link>
          </MenuItem>
        );
      })}
    </ToggleMenuList>
  );
}

export default SlideSubMenu;
