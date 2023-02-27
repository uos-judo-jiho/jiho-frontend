import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Col from "../../layouts/Col";

const LinkWrapper = styled.div`
  padding: 1rem;
`;

function AdminNavPage() {
  return (
    <Col>
      <LinkWrapper>
        <Link to={"/"}>uosjudo.com</Link>
      </LinkWrapper>
      <LinkWrapper>
        <Link to={"/admin/training"}>훈련일지관리</Link>
      </LinkWrapper>
      <LinkWrapper>
        <Link to={"/admin/news"}>지호지관리</Link>
      </LinkWrapper>
    </Col>
  );
}

export default AdminNavPage;
