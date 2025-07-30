import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";

const About = lazy(() => import("../pages/About"));
const NewsPage = lazy(() => import("../pages/News"));
const News = lazy(() => import("../pages/News/News"));
const NewsDetail = lazy(() => import("../pages/News/NewsDetail"));
const Notice = lazy(() => import("../pages/Notice/Notice"));
const NoticeDetail = lazy(() => import("../pages/Notice/NoticeDetail"));
const PhotoPage = lazy(() => import("../pages/Photo"));
const PhotoPC = lazy(() => import("../pages/Photo/PhotoPC"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AdminHomePage = lazy(() => import("../pages/admin/AdminHomePage"));

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
      <Route path="/notice" element={<Notice />} />
      <Route path="/notice/:id" element={<NoticeDetail />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/admin/*" element={<AdminHomePage />} />
    </Routes>
  );
};

export default AppRouter;
