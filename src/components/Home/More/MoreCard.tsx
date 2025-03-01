import { Link } from "react-router-dom";
import styled from "styled-components";
import Row from "../../../layouts/Row";
import { ArticleInfoType } from "../../../types/ArticleInfoType";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type MoreCardProps = {
  title: string;
  data: ArticleInfoType[];
  linkTo: string;
  isLinkToQuery?: boolean;
};

const DATA_LEN = 4;

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
    <Card className="w-full hover:shadow-md">
      <CardHeader>
        <Link to={linkTo}>
          <div className="flex items-center justify-start">
            <h3 className="text-base font-semibold">{title}</h3>
            <More>+ 더보기</More>
          </div>
        </Link>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default MoreCard;
