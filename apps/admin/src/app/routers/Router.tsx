import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import { WithSuspense } from "@/components/utils/WithSuspense";
import Helmet from "@/features/seo/helmet/Helmet";

import NavPage from "../../pages/NavPage";
import NewsIndex from "../../pages/News/NewsIndex";
import NewsYear from "../../pages/News/NewsYear";
import Notice from "../../pages/Notice/Notice";
import TrainingLog from "../../pages/trainingLog/TrainingLog";

const WriteArticlePage = lazy(() => import("../../pages/WriteArticlePage"));
const Gallery = lazy(() => import("../../pages/News/Gallery/Gallery"));
const GalleryIndex = lazy(
  () => import("../../pages/News/Gallery/GalleryIndex"),
);
const GalleryWrite = lazy(
  () => import("../../pages/News/Gallery/GalleryWrite"),
);
const TrainingLogDetail = lazy(
  () => import("../../pages/trainingLog/TrainingLogDetail"),
);
const NewsDetail = lazy(() => import("../../pages/News/NewsDetail"));
const NoticeDetail = lazy(() => import("../../pages/Notice/NoticeDetail"));

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
              <GalleryIndex />
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
