import NewsForm from "@/components/admin/form/NewsForm";
import NewsGalleryFrom from "@/components/admin/form/NewsGalleryFrom";
import NoticeForm from "@/components/admin/form/NoticeForm";
import TrainingLogForm from "@/components/admin/form/TrainingLogForm";

const WriteArticlePage = () => {
  const pathname = window.location.pathname;
  const params = new URLSearchParams(document.location.search);

  const today = new Date().toISOString().slice(0, 10);
  const year = params.get("year")?.concat(today.slice(4, 10)) ?? today;

  const path = pathname.split("/");
  switch (path[1]) {
    case "training":
      return <TrainingLogForm />;
    case "news":
      return path.length > 2 && path[2] === "gallery" ? (
        <NewsGalleryFrom year={year} />
      ) : (
        <NewsForm />
      );
    case "notice":
      return <NoticeForm />;

    default:
      return <></>;
  }
};

export default WriteArticlePage;
