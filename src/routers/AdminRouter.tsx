import { Route, Routes } from "react-router-dom";
import AdminNavPage from "../pages/admin/AdminNavPage";
import AdminNews from "../pages/admin/News/AdminNews";
import AdminTrainingLog from "../pages/admin/trainingLog/AdminTrainingLog";
import AdminTrainingLogDetail from "../pages/admin/trainingLog/AdminTrainingLogDetail";
import AdminNewsDetail from "../pages/admin/News/AdminNewsDetail";

function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminNavPage />} />
      <Route path="home" element={<AdminNavPage />} />
      <Route path="training" element={<AdminTrainingLog />} />
      <Route path="training/:id" element={<AdminTrainingLogDetail />} />
      <Route path="news" element={<AdminNews />} />
      <Route path="news/:id" element={<AdminNewsDetail />} />
    </Routes>
  );
}

export default AdminRouter;
