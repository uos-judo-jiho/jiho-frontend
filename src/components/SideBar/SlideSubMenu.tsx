import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

type SlideSubMenuProps = {
  selected: boolean;

  menuId: string;
  itemsInfo: {
    href: string;
    title: string;
  }[];
};

const slideDown = (count: number) => keyframes`
    from {
      height: 0px;
    }
    to {
        /* 32px 은 theme.descriptionFontSize 의 2배*/
      height: ${count * 32}px;
    }
`;
const slideUp = (count: number) => keyframes`
    from {
        /* 32px 은 theme.descriptionFontSize 의 2배*/
        height: ${count * 32}px;
    }
    to {
      height: 0px;
      display: none;
    }
`;

const ToggleMenuList = styled.ul<{ count: number }>`
  width: 100%;
  overflow: hidden;
  font-size: ${(props) => props.theme.descriptionFontSize};

  &.selected {
    display: block;
    animation: ${(props) => slideDown(props.count)} 1s;
  }

  animation: ${(props) => slideUp(props.count)} 1s forwards;
`;

const MenuItem = styled.li`
  margin: 0 8px;
  line-height: 200%;
`;

function SlideSubMenu({ selected, itemsInfo, menuId }: SlideSubMenuProps) {
  const itemCount = itemsInfo.length;
  return (
    <ToggleMenuList
      id={menuId}
      className={selected ? "selected" : ""}
      count={itemCount}
    >
      {itemsInfo.map((itemInfo) => {
        return (
          <MenuItem key={itemInfo.title}>
            <Link to={itemInfo.href}>{itemInfo.title}</Link>
          </MenuItem>
        );
      })}
    </ToggleMenuList>
  );
}

export default SlideSubMenu;
