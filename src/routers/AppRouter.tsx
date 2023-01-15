import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import News from "../pages/News";
import TrainingLog from "../pages/TrainingLog";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/news" element={<News />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/traingLog" element={<TrainingLog />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
