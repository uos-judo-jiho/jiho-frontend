import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loading from "@/components/common/Skeletons/Loading";

import News from "@/pages/News/News";
import NewsDetail from "@/pages/News/NewsDetail";
import NewsDetailPage from "@/pages/News/NewsDetailPage";
import Photo from "@/pages/Photo/Photo";
import PhotoDetail from "@/pages/Photo/PhotoDetail";
import Home from "../pages/Home";

const WithSuspense = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

const About = lazy(() => import("../pages/About"));
const Notice = lazy(() => import("../pages/Notice/Notice"));
const NoticeDetail = lazy(() => import("../pages/Notice/NoticeDetail"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AdminHomePage = lazy(() => import("../pages/admin/AdminHomePage"));

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
