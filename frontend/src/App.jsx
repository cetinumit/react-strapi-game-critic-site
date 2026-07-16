import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* MainLayout tüm sayfalar için iskelet görevi görür */}
        <Route path="/" element={<MainLayout />}>
          {/* Ana Sayfa */}
          <Route index element={<Home />} />

          {/* 2. Sayfamız (Detay Sayfası - Bir sonraki adımda kodlayacağız, şimdilik yer tutucu koyalım) */}
          <Route
            path="review/:slug"
            element={
              <div className="py-20 text-center text-slate-400">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Detay Sayfası Yapım Aşamasında
                </h2>
                <p>Adım 5'te bu sayfayı tasarlayacağız!</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
