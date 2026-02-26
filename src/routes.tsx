import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages";
import Posts from "./pages/posts";
import QwenDemoPage from "./pages/qwen-demo";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<Posts />} />
        <Route path="/qwen-demo" element={<QwenDemoPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
