import { Route, Routes } from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import NewsPage from "../pages/News";
import News from "../pages/News/News";
import NewsDetail from "../pages/News/NewsDetail";
import NotFound from "../pages/NotFound";
import Notice from "../pages/Notice/Notice";
import NoticeDetail from "../pages/Notice/NoticeDetail";
import PhotoPage from "../pages/Photo";
import PhotoPC from "../pages/Photo/PhotoPC";
import Video from "../pages/Video";
import AdminHomePage from "../pages/admin/AdminHomePage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/news/:id/:index" element={<NewsPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/photo" element={<PhotoPC />} />
      <Route path="/photo/:id" element={<PhotoPage />} />
      <Route path="/video" element={<Video />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/notice/:id" element={<NoticeDetail />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/admin/*" element={<AdminHomePage />} />
    </Routes>
  );
};

export default AppRouter;
