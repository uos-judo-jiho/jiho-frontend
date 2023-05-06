import React from "react";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import Title from "../../layouts/Title";
import { Constants } from "../../constant/constant";
import Line from "../../layouts/Line";
import ListContainer from "../../components/Notice/ListContainer";

function Notice() {
  return (
    <>
      <MyHelmet helmet="Notice" />

      <DefaultLayout>
        <SheetWrapper>
          <Title title={"공지사항"} color={Constants.BLACK_COLOR} />
          <Line margin="1rem 0" borderColor={Constants.GREY_COLOR} />
          <ListContainer />
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default Notice;
