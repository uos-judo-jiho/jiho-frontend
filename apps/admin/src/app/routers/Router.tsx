import { Route, Routes } from "react-router-dom";

import { WithSuspense } from "@/components/utils/WithSuspense";
import Helmet from "@/features/seo/helmet/Helmet";

import { Awards } from "@/pages/Awards/Awards";
import Gallery from "@/pages/News/Gallery/Gallery";
import { GalleryList } from "@/pages/News/Gallery/GalleryList";
import GalleryWrite from "@/pages/News/Gallery/GalleryWrite";
import NewsDetail from "@/pages/News/NewsDetail";
import NoticeDetail from "@/pages/Notice/NoticeDetail";
import TrainingLogDetail from "@/pages/trainingLog/TrainingLogDetail";
import WriteArticlePage from "@/pages/WriteArticlePage";
import NavPage from "../../pages/NavPage";
import NewsIndex from "../../pages/News/NewsIndex";
import NewsYear from "../../pages/News/NewsYear";
import Notice from "../../pages/Notice/Notice";
import TrainingLog from "../../pages/trainingLog/TrainingLog";

const Router = () => {
  return (
    <>
      <Helmet title="관리자" />
      <Routes>
        <Route path="/" element={<NavPage />} />
        <Route path="home" element={<NavPage />} />
        <Route path="training" element={<TrainingLog />} />
        <Route
          path="training/:id"
          element={
            <WithSuspense>
              <TrainingLogDetail />
            </WithSuspense>
          }
        />
        <Route
          path="training/write"
          element={
            <WithSuspense>
              <WriteArticlePage />
            </WithSuspense>
          }
        />
        <Route path="news" element={<NewsIndex />} />
        <Route
          path="news/gallery"
          element={
            <WithSuspense>
              <GalleryList />
            </WithSuspense>
          }
        />
        <Route path="news/:year" element={<NewsYear />} />
        <Route
          path="news/:year/gallery"
          element={
            <WithSuspense>
              <Gallery />
            </WithSuspense>
          }
        />
        <Route
          path="news/:year/gallery/write"
          element={
            <WithSuspense>
              <GalleryWrite />
            </WithSuspense>
          }
        />
        <Route
          path="news/:year/:id"
          element={
            <WithSuspense>
              <NewsDetail />
            </WithSuspense>
          }
        />
        <Route
          path="news/:year/write"
          element={
            <WithSuspense>
              <WriteArticlePage />
            </WithSuspense>
          }
        />
        <Route path="notice" element={<Notice />} />
        <Route path="awards" element={<Awards />} />
        <Route
          path="notice/:id"
          element={
            <WithSuspense>
              <NoticeDetail />
            </WithSuspense>
          }
        />
        <Route
          path="notice/write"
          element={
            <WithSuspense>
              <WriteArticlePage />
            </WithSuspense>
          }
        />
      </Routes>
    </>
  );
};

export default Router;
