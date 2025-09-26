import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Loading from "@/components/common/Skeletons/Loading";

import Home from "../pages/Home";
import News from "@/pages/News";
import NewsDetail from "@/pages/News/NewsDetail";
import NewsPage from "@/pages/News";
import PhotoPC from "@/pages/Photo/PhotoPC";
import PhotoPage from "@/pages/Photo";

const WithSuspense = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

const About = lazy(() => import("../pages/About"));
// const NewsPage = lazy(() => import("../pages/News"));
// const News = lazy(() => import("../pages/News/News"));
// const NewsDetail = lazy(() => import("../pages/News/NewsDetail"));
const Notice = lazy(() => import("../pages/Notice/Notice"));
const NoticeDetail = lazy(() => import("../pages/Notice/NoticeDetail"));
// const PhotoPage = lazy(() => import("../pages/Photo"));
// const PhotoPC = lazy(() => import("../pages/Photo/PhotoPC"));
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
            <NewsPage />
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
            <PhotoPC />
          </WithSuspense>
        }
      />
      <Route
        path="/photo/:id"
        element={
          <WithSuspense>
            <PhotoPage />
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
