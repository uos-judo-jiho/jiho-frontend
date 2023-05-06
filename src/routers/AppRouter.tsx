import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "../pages/About";
import AdminHomePage from "../pages/admin/AdminHomePage";
import Home from "../pages/Home";
import News from "../pages/News/News";
import NewsDetail from "../pages/News/NewsDetail";
import NotFound from "../pages/NotFound";
import Photo from "../pages/Photo";
import Video from "../pages/Video";
import ScrollToTop from "./ScrollTop";
import Notice from "../pages/Notice/Notice";
import NoticeDetail from "../pages/Notice/NoticeDetail";

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/news/:id/:index" element={<NewsDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/photo/:id" element={<Photo />} />
        <Route path="/video" element={<Video />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/*" element={<AdminHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
