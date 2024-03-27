import styled from "styled-components";
import { ReactComponent as PlusSvg } from "../../assets/svgs/plus.svg";

const MenuList = styled.ul`
  font-size: ${(props) => props.theme.descriptionFontSize};
`;

const MenuToggle = styled.a``;

const MenuItemTitle = styled.span`
  line-height: 200%;
`;

const MenuItem = styled.li`
  margin: 0 8px;
`;

const StyledPlus = styled(PlusSvg)`
  cursor: pointer;
  margin-top: -2px;
`;

export type SelectedType = "selected" | "animate" | "closed";

export type MenuProps = {
  selected: SelectedType[];
  setSelected: React.Dispatch<React.SetStateAction<SelectedType[]>>;
};

export { MenuList, MenuToggle, MenuItemTitle, MenuItem, StyledPlus };
