import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "../pages/About";
import AdminHome from "../pages/admin/AdminHome";
import Home from "../pages/Home";
import News from "../pages/News";
import NewsDetail from "../pages/News/NewsDetail";
import NotFound from "../pages/NotFound";
import Photo from "../pages/Photo";
import Video from "../pages/Video";
import ScrollToTop from "./ScrollTop";

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/video" element={<Video />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<AdminHome />}>
          <Route path="home" element={<AdminHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
