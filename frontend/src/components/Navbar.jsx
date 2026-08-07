import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AddEntryIcon,
  ExitIcon,
  AccessIcon,
  OperatorIcon,
} from "../components/icons";
import { isAuthenticated, getCurrentUser, logoutUser } from "../api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    window.location.reload();
  };

  const handleReviewsClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("latest")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("latest")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const isHomeActive = location.pathname === "/" && location.hash !== "#latest";
  const isReviewsActive =
    location.pathname.startsWith("/review") || location.hash === "#latest";

  return (
    <header className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-line transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-xl font-gaming tracking-tighter rounded-sm transform group-hover:scale-105 transition-transform duration-300">
            TC
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-xl tracking-wider font-gaming uppercase">
              TECH<span className="text-zinc-500">CRITIC</span>
            </span>
            <span className="text-[9px] text-zinc-400 tracking-[0.2em] uppercase -mt-1 font-semibold">
              İnceleme Portalı
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400 font-gaming">
          <Link
            to="/"
            className={`transition-colors py-2 border-b-2 ${
              isHomeActive
                ? "text-white border-white"
                : "text-zinc-400 border-transparent hover:text-white hover:border-line"
            }`}
          >
            ANA SAYFA
          </Link>

          <a
            href="#latest"
            onClick={handleReviewsClick}
            className={`transition-colors py-2 border-b-2 cursor-pointer ${
              isReviewsActive
                ? "text-white border-white"
                : "text-zinc-400 border-transparent hover:text-white hover:border-line"
            }`}
          >
            İNCELEMELER
          </a>

          <a
            href="/#about"
            className="text-zinc-400 border-transparent hover:text-white transition-colors py-2 border-b-2 hover:border-line"
          >
            HAKKIMIZDA
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {isAuth ? (
            <div className="flex items-center gap-3 bg-panel border border-line p-1.5">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-300 px-3 py-1 bg-panel-raised font-gaming">
                <OperatorIcon className="w-3.5 h-3.5 text-phosphor" />
                {user?.username || "EDİTÖR"}
              </span>

              <Link
                to="/new-review"
                className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-extrabold px-4 py-2 transition-all uppercase tracking-wider font-gaming"
              >
                <AddEntryIcon className="w-4 h-4 text-black" />
                <span className="hidden sm:inline">YENİ İNCELEME</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Çıkış Yap"
                className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                <ExitIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-zinc-900 hover:bg-white text-zinc-300 hover:text-black text-xs font-bold px-5 py-2.5 border border-line hover:border-white transition-all duration-300 uppercase tracking-widest font-gaming group"
            >
              <AccessIcon className="w-3.5 h-3.5 text-phosphor group-hover:text-black transition-colors" />
              <span>EDİTÖR GİRİŞİ</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
