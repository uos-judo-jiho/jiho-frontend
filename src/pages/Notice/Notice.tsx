import { useEffect } from "react";
import { Constants } from "../../constant";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import Line from "../../layouts/Line";
import ListContainer from "../../layouts/ListContainer";
import SheetWrapper from "../../layouts/SheetWrapper";
import Title from "../../layouts/Title";
import { useNotices } from "../../recoills/notices";

function Notice() {
  const { notices, fetch } = useNotices();

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <MyHelmet title="Notice" />
      <DefaultLayout>
        <SheetWrapper>
          <Title title={"공지사항"} color={Constants.BLACK_COLOR} />
          <Line margin="1rem 0" borderColor={Constants.GREY_COLOR} />
          <ListContainer datas={notices} targetUrl={"/notice/"} />
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default Notice;
