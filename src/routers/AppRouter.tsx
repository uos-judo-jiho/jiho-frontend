import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import { WithSuspense } from "@/components/utils/WithSuspense";

import AdminHomePage from "@/pages/admin/AdminHomePage";
import News from "@/pages/News/News";
import NewsDetail from "@/pages/News/NewsDetail";
import NewsDetailPage from "@/pages/News/NewsDetailPage";
import Photo from "@/pages/Photo/Photo";
import PhotoDetail from "@/pages/Photo/PhotoDetail";
import Home from "../pages/Home";

const About = lazy(() => import("../pages/About"));
const Notice = lazy(() => import("../pages/Notice/Notice"));
const NoticeDetail = lazy(() => import("../pages/Notice/NoticeDetail"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/news/:id/:index" element={<NewsDetailPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/photo" element={<Photo />} />
      <Route path="/photo/:id" element={<PhotoDetail />} />
      <Route
        path="/notice"
        element={
          <WithSuspense>
            <Notice />
          </WithSuspense>
        }
      />
      <Route
        path="/notice/:id"
        element={
          <WithSuspense>
            <NoticeDetail />
          </WithSuspense>
        }
      />
      <Route
        path="*"
        element={
          <WithSuspense>
            <NotFound />
          </WithSuspense>
        }
      />
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
