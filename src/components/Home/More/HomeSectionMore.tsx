import React from "react";
import SheetWrapper from "../../../layouts/SheetWrapper";
import { Link } from "react-router-dom";

function HomeSectionMore() {
  return (
    <SheetWrapper>
      <Link to={"/notice"}>공지사항</Link>
    </SheetWrapper>
  );
}

export default HomeSectionMore;
