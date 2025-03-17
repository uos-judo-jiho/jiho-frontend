import NewsForm from "@/components/admin/form/NewsForm";
import NewsGalleryFrom from "@/components/admin/form/NewsGalleryFrom";
import NoticeForm from "@/components/admin/form/NoticeForm";
import TrainingLogForm from "@/components/admin/form/TrainingLogForm";
import { Constants } from "@/lib/constant";
import Title from "@/components/layouts/Title";

const WriteArticlePage = () => {
  const pathname = window.location.pathname;
  const params = new URLSearchParams(document.location.search);

  const today = new Date().toISOString().slice(0, 10);
  const year = params.get("year")?.concat(today.slice(4, 10)) ?? today;

  const path = pathname.split("/");
  switch (path[2]) {
    case "training":
      return (
        <>
          <Title title={"훈련일지 글쓰기"} color={Constants.BLACK_COLOR} />
          <TrainingLogForm />
        </>
      );
    case "news":
      return path.length > 3 && path[3] === "gallery" ? (
        <>
          <Title
            title={`${year.slice(0, 4)}년 갤러리 쓰기`}
            color={Constants.BLACK_COLOR}
          />
          <NewsGalleryFrom year={year} />
        </>
      ) : (
        <>
          <Title title={"지호지 글쓰기"} color={Constants.BLACK_COLOR} />
          <NewsForm />
        </>
      );
    case "notice":
      return (
        <>
          <Title title={"공지사항 글쓰기"} color={Constants.BLACK_COLOR} />
          <NoticeForm />
        </>
      );

    default:
      return <></>;
  }
};

export default WriteArticlePage;
