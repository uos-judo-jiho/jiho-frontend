import React from "react";
import styled from "styled-components";
import demoNotice from "../../assets/jsons/tmpNotice.json";
import { Link } from "react-router-dom";

const Container = styled.div``;
const ItemList = styled.ul`
  font-size: ${(props) => props.theme.defaultFontSize};
  color: ${(props) => props.theme.textColor};
`;
const Item = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
`;
const DescriptionWrapper = styled.span`
  opacity: 0.8;
  max-width: 60%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover {
    opacity: 1;
    text-decoration-line: underline;
  }
`;
const DateTimeWrapper = styled.span`
  text-align: end;
`;
function ListContainer() {
  return (
    <Container>
      <ItemList>
        {demoNotice.map((data) => {
          return (
            <Item key={data.title + data.id}>
              <DescriptionWrapper>
                <Link to={"/notice/" + data.id}>{data.title}</Link>
              </DescriptionWrapper>
              <DateTimeWrapper>{data.dateTime}</DateTimeWrapper>
            </Item>
          );
        })}
      </ItemList>
    </Container>
  );
}

export default ListContainer;
