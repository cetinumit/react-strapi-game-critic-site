import React from "react";

const Footer = () => {
  return (
    <footer className="bg-void border-t border-line mt-20 py-8 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs text-zinc-500 font-data">
          © {new Date().getFullYear()} TECHCRITIC — TÜM HAKLARI SAKLIDIR. REACT,
          VITE & STRAPI MİMARİSİ İLE ÜRETİLMİŞTİR.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
