import { useEffect } from "react";
import { Link, redirect, useParams } from "react-router-dom";
import styled from "styled-components";
import NoticeDescription from "../../components/Notice/NoticeDetail/NoticeDescription";
import NoticeFooter from "../../components/Notice/NoticeDetail/NoticeFooter";
import NoticeTitle from "../../components/Notice/NoticeDetail/NoticeTitle";
import { Constants } from "@/lib/constant";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { useNotices } from "../../recoills/notices";

const TitleWrapper = styled.div`
  width: min-content;

  &:hover {
    text-decoration: underline solid;
  }
`;

const NoticeDetail = () => {
  const { id } = useParams();
  const { notices, fetch } = useNotices();

  useEffect(() => {
    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = notices.find((value) => value.id.toString() === id?.toString());

  if (!data) {
    redirect("/notice");
    return <></>;
  }

  const metaDescription = [data.title, data.description.slice(0, 80)].join(
    " | "
  );

  const metaImgUrl = data.imgSrcs[0];

  return (
    <>
      <MyHelmet
        title="Notice"
        description={metaDescription}
        imgUrl={metaImgUrl}
      />
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
};

export default NoticeDetail;
