import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

import AdminNavPage from "../pages/admin/AdminNavPage";
import AdminNews from "../pages/admin/News/AdminNews";
import AdminNotice from "../pages/admin/Notice/AdminNotice";
import AdminTrainingLog from "../pages/admin/trainingLog/AdminTrainingLog";

const WriteArticlePage = lazy(() => import("../pages/admin/WriteArticlePage"));
const AdminGallery = lazy(
  () => import("../pages/admin/News/Gallery/AdminGallery")
);
const AdminTrainingLogDetail = lazy(
  () => import("../pages/admin/trainingLog/AdminTrainingLogDetail")
);
const AdminNewsDetail = lazy(
  () => import("../pages/admin/News/AdminNewsDetail")
);
const AdminNoticeDetail = lazy(
  () => import("../pages/admin/Notice/AdminNoticeDetail")
);

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminNavPage />} />
      <Route path="home" element={<AdminNavPage />} />
      <Route path="training" element={<AdminTrainingLog />} />
      <Route path="training/:id" element={<AdminTrainingLogDetail />} />
      <Route path="training/write" element={<WriteArticlePage />} />
      <Route path="news" element={<AdminNews />} />
      <Route path="news/:id" element={<AdminNewsDetail />} />
      <Route path="news/write" element={<WriteArticlePage />} />
      <Route path="news/gallery" element={<AdminGallery />} />
      <Route path="news/gallery/write" element={<WriteArticlePage />} />
      <Route path="notice" element={<AdminNotice />} />
      <Route path="notice/:id" element={<AdminNoticeDetail />} />
      <Route path="notice/write" element={<WriteArticlePage />} />
    </Routes>
  );
};

export default AdminRouter;
