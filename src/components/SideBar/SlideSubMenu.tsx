import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { MenuItemInfoType } from "../../types/MenuItemInfoType";

type SlideSubMenuProps = {
  selected: boolean;
  menuId: string;
  itemsInfo: MenuItemInfoType[];
};

const slideDown = (count: number) => keyframes`
    from {
      height: 0;
    }
    to {
      height: ${count * 2 * 1.6}rem;
    }
`;
const slideUp = (count: number) => keyframes`
    from {
        height: ${count * 2 * 1.6}rem;
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

  animation: ${(props) => slideUp(props.count)} 1s forwards;
`;

const MenuItem = styled.li`
  margin: 0 0.5rem;
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
