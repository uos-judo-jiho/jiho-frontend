import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Col from "../../layouts/Col";

import { ReactComponent as LeftArrow } from "../../assets/svgs/arrow_forward_ios.svg";

type AdminNavItemProps = {
  linkTo: string;
  title: string;
};

const TitleSpan = styled.span`
  font-size: ${(props) => props.theme.defaultFontSize};
`;

const LinkWrapper = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
`;

const StyledArrow = styled(LeftArrow)`
  width: 2rem;
  margin-left: 1rem;
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
