import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "../pages/About";
import AdminHomePage from "../pages/admin/AdminHomePage";
import Home from "../pages/Home";
import News from "../pages/News";
import NewsDetail from "../pages/News/NewsDetail";
import NotFound from "../pages/NotFound";
import Photo from "../pages/Photo";
import Test from "../pages/Test";
import Test2 from "../pages/Test2";
import Video from "../pages/Video";
import ScrollToTop from "./ScrollTop";

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/test2" element={<Test2 />} />
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/video" element={<Video />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/*" element={<AdminHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
