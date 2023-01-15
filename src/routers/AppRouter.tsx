import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import News from "../pages/News";
import TrainingLog from "../pages/TrainingLog";
import Video from "../pages/Video";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/news" element={<News />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/trainingLog" element={<TrainingLog />}></Route>
        <Route path="/video" element={<Video />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
