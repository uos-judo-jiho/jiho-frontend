import { Link } from "react-router-dom";
import styled from "styled-components";

const MenuList = styled.ul`
  font-size: ${(props) => props.theme.descriptionFontSize};
`;

const MenuToggle = styled(Link)``;

const MenuItemTitle = styled.span`
  line-height: 200%;

  cursor: pointer;
  &:hover {
    ${({ theme }) => `color: ${theme.greyColor};`}
  }
`;

const MenuItem = styled.li`
  margin: 0 8px;
`;

export type SelectedType = "selected" | "animate" | "closed";

export type MenuProps = {
  selected: [SelectedType, SelectedType];
  setSelected: React.Dispatch<React.SetStateAction<[SelectedType, SelectedType]>>;
};

export { MenuItem, MenuItemTitle, MenuList, MenuToggle };
