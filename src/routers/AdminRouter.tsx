import { Route, Routes } from "react-router-dom";
import AdminNavPage from "../pages/admin/AdminNavPage";
import AdminNews from "../pages/admin/News/AdminNews";
import AdminTrainingLog from "../pages/admin/trainingLog/AdminTrainingLog";
import AdminTrainingLogDetail from "../pages/admin/trainingLog/AdminTrainingLogDetail";
import AdminNewsDetail from "../pages/admin/News/AdminNewsDetail";
import WriteArticlePage from "../pages/admin/WriteArticlePage";
import AdminNotice from "../pages/admin/Notice/AdminNotice";
import AdminNoticeDetail from "../pages/admin/Notice/AdminNoticeDetail";

function AdminRouter() {
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
      <Route path="notice" element={<AdminNotice />} />
      <Route path="notice/:id" element={<AdminNoticeDetail />} />
      <Route path="notice/write" element={<WriteArticlePage />} />
    </Routes>
  );
}

export default AdminRouter;
