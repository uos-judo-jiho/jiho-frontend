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
      <Route
        path="/news"
        element={
          <WithSuspense>
            <News />
          </WithSuspense>
        }
      />
      <Route
        path="/news/:id"
        element={
          <WithSuspense>
            <NewsDetail />
          </WithSuspense>
        }
      />
      <Route
        path="/news/:id/:index"
        element={
          <WithSuspense>
            <NewsDetailPage />
          </WithSuspense>
        }
      />
      <Route
        path="/about"
        element={
          <WithSuspense>
            <About />
          </WithSuspense>
        }
      />
      <Route
        path="/photo"
        element={
          <WithSuspense>
            <Photo />
          </WithSuspense>
        }
      />
      <Route
        path="/photo/:id"
        element={
          <WithSuspense>
            <PhotoDetail />
          </WithSuspense>
        }
      />
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
