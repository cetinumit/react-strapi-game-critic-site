import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 py-8 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-6">
        <p>
          © {new Date().getFullYear()} TechCritic — Tüm hakları saklıdır. React,
          Vite & Strapi mimarisi ile üretilmiştir.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
