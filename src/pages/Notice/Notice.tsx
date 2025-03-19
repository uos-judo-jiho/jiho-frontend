import { useEffect } from "react";
import { Constants } from "@/lib/constant";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Line from "@/components/layouts/Line";
import ListContainer from "@/components/layouts/ListContainer";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { useNotices } from "@/recoils/notices";

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
