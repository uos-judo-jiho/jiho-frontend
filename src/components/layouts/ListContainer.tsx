import { Link } from "react-router-dom";
import styled from "styled-components";
import { Constants } from "@/lib/constant";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import Line from "./Line";

type ListContainerProps = {
  datas: Partial<ArticleInfoType>[];
  targetUrl: string;
  additionalTitle?: boolean;
};

const Container = styled.div``;
const ItemList = styled.ul`
  font-size: ${(props) => props.theme.defaultFontSize};
  color: ${(props) => props.theme.textColor};
`;
const Item = styled.li`
  display: flex;
  padding: 1.2rem 0;
  text-align: center;
`;
const DescriptionWrapper = styled.div`
  flex: 80%;
`;

const LinkWrapper = styled.div`
  background-color: transparent;
  text-align: start;

  padding-right: 12px;

  &:hover {
    text-decoration-line: underline;
  }
`;
const DateTimeWrapper = styled.div`
  white-space: nowrap;
  text-align: center;
  flex: 10%;
`;
const TagWrapper = styled.div`
  text-align: center;
  flex: 10%;
`;
function ListContainer({
  datas: data,
  targetUrl,
  additionalTitle = false,
}: ListContainerProps) {
  return (
    <Container>
      <ItemList>
        <Item>
          <TagWrapper>번호</TagWrapper>
          <DescriptionWrapper>제목</DescriptionWrapper>
          <DateTimeWrapper>작성일</DateTimeWrapper>
        </Item>
        <Line borderColor={Constants.LIGHT_GREY_COLOR} borderWidth="1px" />

        {data.map((data, index) => (
          <div key={data?.id}>
            <Item>
              <TagWrapper>{index + 1}</TagWrapper>
              <DescriptionWrapper>
                <Link to={targetUrl + data.id}>
                  <LinkWrapper>
                    {data.title}
                    {additionalTitle ? " " + data.author : ""}
                  </LinkWrapper>
                </Link>
              </DescriptionWrapper>
              <DateTimeWrapper>{data.dateTime}</DateTimeWrapper>
            </Item>
            <Line borderColor={Constants.LIGHT_GREY_COLOR} borderWidth="1px" />
          </div>
        ))}
      </ItemList>
    </Container>
  );
}

export default ListContainer;
