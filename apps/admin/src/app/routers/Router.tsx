import { Route, Routes } from "react-router-dom";

import { WithSuspense } from "@/components/utils/WithSuspense";

import Login from "@/components/admin/form/Login";
import Helmet from "@/components/common/helmet/Helmet";
import { Awards } from "@/pages/Awards/Awards";
import Gallery from "@/pages/News/Gallery/Gallery";
import { GalleryList } from "@/pages/News/Gallery/GalleryList";
import GalleryWrite from "@/pages/News/Gallery/GalleryWrite";
import NewsDetail from "@/pages/News/NewsDetail";
import NoticeDetail from "@/pages/Notice/NoticeDetail";
import { Register } from "@/pages/Register";
import TrainingLogDetail from "@/pages/trainingLog/TrainingLogDetail";
import WriteArticlePage from "@/pages/WriteArticlePage";
import NavPage from "../../pages/NavPage";
import NewsIndex from "../../pages/News/NewsIndex";
import NewsYear from "../../pages/News/NewsYear";
import Notice from "../../pages/Notice/Notice";
import TrainingLog from "../../pages/trainingLog/TrainingLog";
import { RouterUrl } from "./router-url";

const WithHelmet = (Component: React.ReactNode, title: string) => {
  return (
    <>
      <Helmet title={title} />
      {Component}
    </>
  );
};

export const AuthRouter = () => {
  return (
    <Routes>
      <Route path={RouterUrl.홈} element={WithHelmet(<NavPage />, "홈")} />
      <Route path="home" element={WithHelmet(<NavPage />, "홈")} />

      {/* 훈련일지 */}
      <Route
        path={RouterUrl.훈련일지.목록}
        element={WithHelmet(<TrainingLog />, "훈련일지")}
      />
      <Route
        path={RouterUrl.훈련일지.상세({ id: ":id" as unknown as number })}
        element={WithHelmet(
          <WithSuspense>
            <TrainingLogDetail />
          </WithSuspense>,
          "훈련일지 상세",
        )}
      />
      <Route
        path={RouterUrl.훈련일지.작성}
        element={WithHelmet(
          <WithSuspense>
            <WriteArticlePage />
          </WithSuspense>,
          "훈련일지 작성",
        )}
      />

      {/* 지호지 (뉴스) */}
      <Route
        path={RouterUrl.뉴스.목록}
        element={WithHelmet(<NewsIndex />, "지호지")}
      />
      <Route
        path="news/gallery"
        element={WithHelmet(
          <WithSuspense>
            <GalleryList />
          </WithSuspense>,
          "지호지 갤러리",
        )}
      />
      <Route
        path={RouterUrl.뉴스.년도별({ year: ":year" as unknown as number })}
        element={WithHelmet(<NewsYear />, "지호지 년도별")}
      />
      <Route
        path={RouterUrl.뉴스.갤러리({ year: ":year" as unknown as number })}
        element={WithHelmet(
          <WithSuspense>
            <Gallery />
          </WithSuspense>,
          "지호지 갤러리 상세",
        )}
      />
      <Route
        path={RouterUrl.뉴스.갤러리작성({ year: ":year" as unknown as number })}
        element={WithHelmet(
          <WithSuspense>
            <GalleryWrite />
          </WithSuspense>,
          "지호지 갤러리 작성",
        )}
      />
      <Route
        path={RouterUrl.뉴스.상세({
          year: ":year" as unknown as number,
          id: ":id" as unknown as number,
        })}
        element={WithHelmet(
          <WithSuspense>
            <NewsDetail />
          </WithSuspense>,
          "지호지 상세",
        )}
      />
      <Route
        path={RouterUrl.뉴스.작성({ year: ":year" as unknown as number })}
        element={WithHelmet(
          <WithSuspense>
            <WriteArticlePage />
          </WithSuspense>,
          "지호지 작성",
        )}
      />

      {/* 공지사항 */}
      <Route
        path={RouterUrl.공지사항.목록}
        element={WithHelmet(<Notice />, "공지사항")}
      />
      <Route
        path={RouterUrl.공지사항.상세({ id: ":id" as unknown as number })}
        element={WithHelmet(
          <WithSuspense>
            <NoticeDetail />
          </WithSuspense>,
          "공지사항 상세",
        )}
      />
      <Route
        path={RouterUrl.공지사항.작성}
        element={WithHelmet(
          <WithSuspense>
            <WriteArticlePage />
          </WithSuspense>,
          "공지사항 작성",
        )}
      />

      {/* 수상내역 */}
      <Route
        path={RouterUrl.수상내역}
        element={WithHelmet(<Awards />, "수상내역")}
      />
    </Routes>
  );
};

export const PublicRouter = () => {
  return (
    <Routes>
      <Route path={RouterUrl.홈} element={WithHelmet(<Login />, "로그인")} />
      <Route
        path={RouterUrl.로그인}
        element={WithHelmet(<Login />, "로그인")}
      />
      <Route
        path={RouterUrl.회원가입}
        element={WithHelmet(<Register />, "회원가입")}
      />
    </Routes>
  );
};
