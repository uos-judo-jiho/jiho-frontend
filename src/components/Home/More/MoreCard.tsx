import { Link } from "react-router-dom";
import styled from "styled-components";
import Row from "../../../layouts/Row";
import { useEffect, useState } from "react";
import useFetchData from "../../../Hooks/useFetchData";
import { getTrainings } from "../../../api/trainingApi";
import { ArticleInfoType } from "../../../types/ArticleInfoType";
import { getNews } from "../../../api/newsApi";
import demoNotice from "../../../assets/jsons/tmpNotice.json";

type MoreCardProps = {
  title: string;
  description: string;
  linkTo: string;
};

const Card = styled.div`
  width: 100%;
  box-shadow: 0 0.4rem 0.8rem 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: 0.3s;
  &:hover {
    box-shadow: 0 0.8rem 1.6rem 0 rgba(0, 0, 0, 0.2);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.8rem 1.2rem;
`;

const Title = styled.h1``;

const ItemList = styled.ul`
  width: 100%;
  margin: 0.8rem 0;
`;

const Item = styled.li`
  padding: 0.4rem 0;

  &:hover {
    opacity: 0.8;
  }
`;

const ItemWrapper = styled.div`
  display: block;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const More = styled.p`
  padding-left: 1rem;
  color: ${(props) => props.theme.greyColor};
  &:hover {
    color: ${(props) => props.theme.blackColor};
  }
`;

function MoreCard({ title, linkTo, description }: MoreCardProps) {
  const [datas, setDatas] = useState<string[]>([]);
  const [cardType, setCardType] = useState<string>(title);
  // TODO 훈련일지는 이번 년도 데이터 가져오기
  // 혹은 백에서 가장 최근 데이터만 주기

  const { loading, error, response } = useFetchData(
    title === "훈련일지" ? getTrainings : getNews,
    "2022"
  );

  useEffect(() => {
    if (!loading && !error && response) {
      // 가장 최근 데이터만 가져오기

      if (title === "훈련일지") {
        setCardType("photo");
        const sliceDatas = response.trainingLogs.slice(0).reverse().slice(0, 8);

        const datas = sliceDatas.map(
          (log: ArticleInfoType) =>
            "[ " + log.dateTime + " ] " + log.author + " " + log.description
        );
        setDatas(datas);
      } else if (title === "지호지") {
        setCardType("news/2022");
        const sliceDatas = response.articles.slice(0, 8);

        const datas = sliceDatas.map(
          (log: ArticleInfoType) =>
            "[ " + log.author + " ] " + " " + log.description
        );

        setDatas(datas);
      } else if (title === "공지사항") {
        setCardType("notice");
        // TODO api 적용
        const sliceDatas = demoNotice.slice(0, 8);

        const datas = sliceDatas.map(
          (log: ArticleInfoType) =>
            "[ " + log.dateTime + " ] " + " " + log.title
        );

        setDatas(datas);
      }
    }
  }, [loading, error, response]);

  if (!datas) return <></>;
  return (
    <Card>
      <Container>
        <Row alignItems="flex-end" justifyContent="space-between">
          <Title>{title}</Title>
          <Link to={linkTo}>
            <More>+ 더보기</More>
          </Link>
        </Row>
        <ItemList>
          {datas.map((data, index) => {
            return (
              <Item key={title + index}>
                <Link to={cardType + "/" + index}>
                  <ItemWrapper>{data}</ItemWrapper>
                </Link>
              </Item>
            );
          })}
        </ItemList>
      </Container>
    </Card>
  );
}

export default MoreCard;
