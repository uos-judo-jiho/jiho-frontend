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
import SitemapRoutes from "../seo/sitemapRoutes";

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {SitemapRoutes}
    </BrowserRouter>
  );
}

export default AppRouter;
