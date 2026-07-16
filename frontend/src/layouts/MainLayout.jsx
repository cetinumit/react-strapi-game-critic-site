import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-8">
        {/* Router'dan gelen aktif sayfa (Home veya ReviewDetail) burada çalışır */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
