import { Link } from "react-router-dom";
import styled from "styled-components";

import { ReactComponent as LeftArrow } from "../../../assets/svgs/arrow_forward_ios.svg";

type AdminNavItemProps = {
  linkTo: string;
  title: string;
};

const TitleSpan = styled.span`
  font-size: ${(props) => props.theme.defaultFontSize};
`;

const LinkWrapper = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
`;

const StyledArrow = styled(LeftArrow)`
  width: 20px;
  margin-left: 10px;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

function AdminNavItem({ linkTo, title }: AdminNavItemProps) {
  return (
    <LinkWrapper>
      <Link to={linkTo}>
        <ItemWrapper>
          <TitleSpan>{title}</TitleSpan>
          <StyledArrow />
        </ItemWrapper>
      </Link>
    </LinkWrapper>
  );
}

export default AdminNavItem;
