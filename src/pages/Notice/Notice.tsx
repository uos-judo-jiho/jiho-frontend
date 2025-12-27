import { useNoticesQuery } from "@/api/notices/query";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Line from "@/components/layouts/Line";
import ListContainer from "@/components/layouts/ListContainer";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
import { Constants } from "@/shared/lib/constant";

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
