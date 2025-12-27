import { Route, Routes } from "react-router-dom";

import { WithSuspense } from "@/components/utils/WithSuspense";

import { useScrollToTop } from "@/shared/hooks/useScolltoTop";

import About from "@/pages/About";
import AdminHomePage from "@/pages/admin/AdminHomePage";
import Home from "@/pages/Home";
import News from "@/pages/News/News";
import NewsDetailPage from "@/pages/News/NewsDetailPage";
import NewsYear from "@/pages/News/NewsYear";
import NotFound from "@/pages/NotFound";
import Notice from "@/pages/Notice/Notice";
import NoticeDetail from "@/pages/Notice/NoticeDetail";
import Photo from "@/pages/Photo/Photo";
import PhotoDetail from "@/pages/Photo/PhotoDetail";

const AppRouter = () => {
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsYear />} />
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
