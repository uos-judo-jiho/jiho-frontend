import { Route, Routes } from "react-router-dom";
import AdminNavPage from "../pages/admin/AdminNavPage";
import AdminNews from "../pages/admin/AdminNews";
import AdminTrainingLog from "../pages/admin/AdminTrainingLog";

function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminNavPage />} />
      <Route path="home" element={<AdminNavPage />} />
      <Route path="training" element={<AdminTrainingLog />} />
      <Route path="news" element={<AdminNews />} />
    </Routes>
  );
}

export default AdminRouter;
