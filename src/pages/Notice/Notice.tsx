import { Constants } from "@/lib/constant";
import MyHelmet from "@/seo/helmet/MyHelmet";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Line from "@/components/layouts/Line";
import ListContainer from "@/components/layouts/ListContainer";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { useNoticesQuery } from "@/api/notices/query";

function Notice() {
  const { data: notices = [] } = useNoticesQuery();

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
