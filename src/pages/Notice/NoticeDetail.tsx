import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import Title from "../../layouts/Title";
import { Constants } from "../../constant/constant";
import demoNotice from "../../assets/jsons/tmpNotice.json";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import NoticeTitle from "../../components/Notice/NoticeDetail/NoticeTitle";
import NoticeDescription from "../../components/Notice/NoticeDetail/NoticeDescription";
import { Link } from "react-router-dom";
import styled from "styled-components";
import NoticeFooter from "../../components/Notice/NoticeDetail/NoticeFooter";

const TitleWrapper = styled.div`
  width: min-content;

  &:hover {
    text-decoration: underline solid;
  }
`;

function NoticeDetail() {
  const { id } = useParams();
  const [data, setData] = useState<ArticleInfoType>();
  useEffect(() => {
    if (id) {
      const fetchData = demoNotice.find((value) => value.id === id);
      setData(fetchData);
    }
  }, [id]);

  if (!data) return <></>;

  return (
    <>
      <MyHelmet helmet="Notice" />

      <DefaultLayout>
        <SheetWrapper>
          <TitleWrapper>
            <Link to={"/notice"}>
              <Title title={"공지사항"} color={Constants.BLACK_COLOR} />
            </Link>
          </TitleWrapper>
          <NoticeTitle
            title={data.title}
            author={data.author}
            dateTime={data.dateTime}
            tags={data.tags}
          />
          <NoticeDescription description={data.description} />
          <NoticeFooter />
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default NoticeDetail;
