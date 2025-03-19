import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { MenuItemInfoType } from "@/lib/types/menuItemInfoType";
import { SelectedType } from "./MenuStyledComponents";

type SlideSubMenuProps = {
  selected: SelectedType;
  menuId: string;
  itemsInfo: MenuItemInfoType[];
};

const slideDown = (count: number) => keyframes`
    from {
      height: 0;
    }
    to {
      height: ${count * 2 * 1}rem;
    }
`;

const slideUp = (count: number) => keyframes`
    from {
        height: ${count * 2 * 1}rem;
    }
    to {
      height: 0;
      display: none;
    }
`;

const ToggleMenuList = styled.ul<{ count: number }>`
  width: 100%;
  overflow: hidden;
  font-size: ${(props) => props.theme.defaultFontSize};

  &.selected {
    display: block;
    animation: ${(props) => slideDown(props.count)} 1s;
  }

  &.animate {
    animation: ${(props) => slideUp(props.count)} 1s forwards;
  }

  &.closed {
    height: 0;
    display: none;
  }
`;

const MenuItem = styled.li`
  margin: 0 4px;
  line-height: 200%;
`;

const SlideSubMenu = ({ selected, itemsInfo, menuId }: SlideSubMenuProps) => {
  return (
    <ToggleMenuList id={menuId} className={selected} count={itemsInfo.length}>
      {itemsInfo.map((itemInfo) => (
        <MenuItem key={itemInfo.title}>
          <Link to={itemInfo.href}>{itemInfo.title}</Link>
        </MenuItem>
      ))}
    </ToggleMenuList>
  );
};

export default SlideSubMenu;
