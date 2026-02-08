import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import NoticeDescription from "@/components/Notice/NoticeDetail/NoticeDescription";
import NoticeFooter from "@/components/Notice/NoticeDetail/NoticeFooter";
import NoticeTitle from "@/components/Notice/NoticeDetail/NoticeTitle";
import { Constants } from "@/shared/lib/constant";
import { v2Api } from "@packages/api";
import { Link, redirect, useParams } from "react-router-dom";
import MyHelmet from "../../features/seo/helmet/MyHelmet";

const NoticeDetail = () => {
  const { id } = useParams();
  const { data: notices = [] } = v2Api.useGetApiV2Notices(undefined, {
    query: {
      select: (response) => response.data.notices ?? [],
    },
  });

  const data = notices.find((value) => value.id.toString() === id?.toString());

  if (!data) {
    redirect("/notice");
    return <></>;
  }

  const metaDescription = [data.title, data.description.slice(0, 140)].join(
    " | ",
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
          <div className="mb-4 width-min-content hover:underline">
            <Link to={"/notice"}>
              <Title title={"공지사항"} color={Constants.BLACK_COLOR} />
            </Link>
          </div>
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
