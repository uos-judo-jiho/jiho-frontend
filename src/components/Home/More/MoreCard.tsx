import { Link } from "react-router-dom";
import styled from "styled-components";
import Row from "../../../layouts/Row";
import { ArticleInfoType } from "../../../types/ArticleInfoType";

type MoreCardProps = {
  title: string;
  data: ArticleInfoType[];
  linkTo: string;
  isLinkToQuery?: boolean;
};

const DATA_LEN = 4;

const Card = styled.div`
  width: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: 0.3s;
  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 12px;
`;

const Title = styled.h1``;

const ItemList = styled.ul`
  width: 100%;
  margin: 8px 0;
`;

const Item = styled.li`
  padding: 0.4rem 0;

  &:hover {
    opacity: 0.8;
  }
`;

const ItemWrapper = styled.div`
  display: block;

  flex: 1;

  white-space: nowrap;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TimeContent = styled.div`
  min-width: 100px;

  color: ${(props) => props.theme.greyColor};
  text-align: right;
`;

const More = styled.p`
  padding-left: 10px;
  color: ${(props) => props.theme.greyColor};
  line-height: ${(props) => props.theme.descriptionLineHeight};

  &:hover {
    color: ${(props) => props.theme.blackColor};
  }
`;

const MoreCard = ({ title, linkTo, data }: MoreCardProps) => {
  const boardData = data.slice(0, DATA_LEN);
  return (
    <Card>
      <Container>
        <Link to={linkTo}>
          <Row alignItems="flex-end" justifyContent="space-">
            <Title>{title}</Title>
            <More>+ 더보기</More>
          </Row>
        </Link>
        <ItemList>
          {boardData.map((item, index) => {
            return (
              <Item key={title + index}>
                <Link to={`${linkTo}/${item.id}`}>
                  <Row justifyContent="space-between" gap={16}>
                    <ItemWrapper>{`[${item.author}] ${item.description}`}</ItemWrapper>
                    <TimeContent>{item.dateTime}</TimeContent>
                  </Row>
                </Link>
              </Item>
            );
          })}
        </ItemList>
      </Container>
    </Card>
  );
};

export default MoreCard;
