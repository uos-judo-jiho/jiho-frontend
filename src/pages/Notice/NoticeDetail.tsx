import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import Title from "../../layouts/Title";
import { Constants } from "../../constant/constant";
import demoNotice from "../../assets/jsons/tmpNotice.json";
import { ArticleInfoType } from "../../types/ArticleInfoType";

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
          <Title title={"공지사항"} color={Constants.BLACK_COLOR} />
          {Object.values(data)}
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default NoticeDetail;
