import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ReviewDetail from "./pages/ReviewDetail";
import Login from "./pages/Login";
import CreateReview from "./pages/CreateReview"; // <-- 1. Formu aldık
import ProtectedRoute from "./components/ProtectedRoute"; // <-- 2. Güvenlik kalkanını aldık

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="review/:slug" element={<ReviewDetail />} />
          <Route path="login" element={<Login />} />

          {/* 3. Korumalı Rota (Sadece giriş yapmış editörler girebilir!) */}
          <Route
            path="new-review"
            element={
              <ProtectedRoute>
                <CreateReview />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
