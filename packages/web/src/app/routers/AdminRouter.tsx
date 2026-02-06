import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import { WithSuspense } from "@/components/utils/WithSuspense";
import AdminHelmet from "@/features/seo/helmet/AdminHelmet";

import AdminNavPage from "../../pages/admin/AdminNavPage";
import AdminNews from "../../pages/admin/News/AdminNews";
import AdminNewsIndex from "../../pages/admin/News/AdminNewsIndex";
import AdminNotice from "../../pages/admin/Notice/AdminNotice";
import AdminTrainingLog from "../../pages/admin/trainingLog/AdminTrainingLog";

const WriteArticlePage = lazy(
  () => import("../../pages/admin/WriteArticlePage")
);
const AdminGallery = lazy(
  () => import("../../pages/admin/News/Gallery/AdminGallery")
);
const AdminGalleryIndex = lazy(
  () => import("../../pages/admin/News/Gallery/AdminGalleryIndex")
);
const AdminGalleryWrite = lazy(
  () => import("../../pages/admin/News/Gallery/AdminGalleryWrite")
);
const AdminTrainingLogDetail = lazy(
  () => import("../../pages/admin/trainingLog/AdminTrainingLogDetail")
);
const AdminNewsDetail = lazy(
  () => import("../../pages/admin/News/AdminNewsDetail")
);
const AdminNoticeDetail = lazy(
  () => import("../../pages/admin/Notice/AdminNoticeDetail")
);

const AdminRouter = () => {
  return (
    <>
      <AdminHelmet title="관리자" />
      <Routes>
        <Route path="/" element={<AdminNavPage />} />
        <Route path="home" element={<AdminNavPage />} />
        <Route path="training" element={<AdminTrainingLog />} />
        <Route
          path="training/:id"
          element={
            <WithSuspense>
              <AdminTrainingLogDetail />
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
        <Route path="news" element={<AdminNewsIndex />} />
        <Route
          path="news/gallery"
          element={
            <WithSuspense>
              <AdminGalleryIndex />
            </WithSuspense>
          }
        />
        <Route path="news/:year" element={<AdminNews />} />
        <Route
          path="news/:year/gallery"
          element={
            <WithSuspense>
              <AdminGallery />
            </WithSuspense>
          }
        />
        <Route
          path="news/:year/gallery/write"
          element={
            <WithSuspense>
              <AdminGalleryWrite />
            </WithSuspense>
          }
        />
        <Route
          path="news/:year/:id"
          element={
            <WithSuspense>
              <AdminNewsDetail />
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
        <Route path="notice" element={<AdminNotice />} />
        <Route
          path="notice/:id"
          element={
            <WithSuspense>
              <AdminNoticeDetail />
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

export default AdminRouter;
