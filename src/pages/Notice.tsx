import React from "react";
import MyHelmet from "../helmet/MyHelmet";
import DefaultLayout from "../layouts/DefaultLayout";

function Notice() {
  return (
    <>
      <MyHelmet helmet="Home" />

      <DefaultLayout>공지사항</DefaultLayout>
    </>
  );
}

export default Notice;
