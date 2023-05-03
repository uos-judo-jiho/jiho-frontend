import React from "react";
import MyHelmet from "../helmet/MyHelmet";
import DefaultLayout from "../layouts/DefaultLayout";
import SheetWrapper from "../layouts/SheetWrapper";

function Notice() {
  return (
    <>
      <MyHelmet helmet="Notice" />

      <DefaultLayout>
        <SheetWrapper>공지사항</SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default Notice;
