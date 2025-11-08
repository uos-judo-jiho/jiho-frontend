import { Route, Routes } from "react-router-dom";

import { WithSuspense } from "@/components/utils/WithSuspense";

import AdminHomePage from "@/pages/admin/AdminHomePage";
import News from "@/pages/News/News";
import NewsDetail from "@/pages/News/NewsDetail";
import NewsDetailPage from "@/pages/News/NewsDetailPage";
import Photo from "@/pages/Photo/Photo";
import PhotoDetail from "@/pages/Photo/PhotoDetail";
import About from "../pages/About";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Notice from "../pages/Notice/Notice";
import NoticeDetail from "../pages/Notice/NoticeDetail";
import { useScrollToTop } from "@/hooks/useScolltoTop";

const AppRouter = () => {
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/news/:id/:index" element={<NewsDetailPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/photo" element={<Photo />} />
      <Route path="/photo/:id" element={<PhotoDetail />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/notice/:id" element={<NoticeDetail />} />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/admin/*"
        element={
          <WithSuspense>
            <AdminHomePage />
          </WithSuspense>
        }
      />
    </Routes>
  );
};

export default AppRouter;
