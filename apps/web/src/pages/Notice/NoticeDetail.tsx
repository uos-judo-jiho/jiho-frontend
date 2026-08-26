import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import NoticeDescription from "@/components/Notice/NoticeDetail/NoticeDescription";
import NoticeFooter from "@/components/Notice/NoticeDetail/NoticeFooter";
import NoticeTitle from "@/components/Notice/NoticeDetail/NoticeTitle";
import { Constants } from "@/shared/lib/constant";
import { v2Api } from "@packages/api";
import { getRouteApi, Link, Navigate } from "@tanstack/react-router";

const routeApi = getRouteApi("/notice/$id");

const NoticeDetail = () => {
  const { id } = routeApi.useParams();
  const { data: notices = [], isFetched } = v2Api.useGetApiV2Notices(
    undefined,
    {
      query: {
        select: (response) => response.data.notices ?? [],
      },
    },
  );

  const data = notices.find((value) => value.id.toString() === id.toString());

  if (!data) {
    // 데이터 로드 후에도 해당 공지가 없으면 목록으로 이동
    return isFetched ? <Navigate to="/notice" replace /> : <></>;
  }

  return (
    <>
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
